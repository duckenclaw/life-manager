// Tiny EventKit bridge used by Scripts/syncReminders.js (AppleScript is far too slow).
// Build:  swiftc -O -swift-version 5 main.swift -o reminders-bridge
// Usage:  echo '<json>' | reminders-bridge read|apply   → JSON on stdout
//   read  in: {"lists": {"Work": "work", …}, "ids": ["…"]}   (area → Reminders list title)
//         out: {"lists": {"Work": [Rem]}, "byId": {"id": Rem}, "missing": ["id"]}
//   apply in: {"create": [{uid, list, name, due?}], "update": [{id, name?, due?, clearDue?, completed?}]}
//         out: {"created": {"uid": "id"}, "errors": ["…"]}

import EventKit
import Foundation

struct Rem: Codable { let id: String; let name: String; let due: String?; let completed: Bool }
struct ReadIn: Codable { let lists: [String: String]; let ids: [String] }
struct ReadOut: Codable { var lists: [String: [Rem]] = [:]; var byId: [String: Rem] = [:]; var missing: [String] = [] }
struct NewRem: Codable { let uid: String; let list: String; let name: String; let due: String? }
struct Update: Codable { let id: String; let name: String?; let due: String?; let clearDue: Bool?; let completed: Bool? }
struct ApplyIn: Codable { let create: [NewRem]; let update: [Update] }
struct ApplyOut: Codable { var created: [String: String] = [:]; var errors: [String] = [] }

func fail(_ msg: String) -> Never {
    FileHandle.standardError.write((msg + "\n").data(using: .utf8)!)
    exit(1)
}

func emit<T: Encodable>(_ value: T) {
    let data = try! JSONEncoder().encode(value)
    FileHandle.standardOutput.write(data)
}

func dateString(_ c: DateComponents?) -> String? {
    guard let c, let y = c.year, let m = c.month, let d = c.day else { return nil }
    return String(format: "%04d-%02d-%02d", y, m, d)
}

func components(_ s: String) -> DateComponents? {
    let p = s.split(separator: "-").compactMap { Int($0) }
    guard p.count == 3 else { return nil }
    return DateComponents(year: p[0], month: p[1], day: p[2])
}

func rem(_ r: EKReminder) -> Rem {
    Rem(id: r.calendarItemIdentifier, name: r.title ?? "", due: dateString(r.dueDateComponents), completed: r.isCompleted)
}

let store = EKEventStore()

func requestAccess() {
    let sem = DispatchSemaphore(value: 0)
    var granted = false
    store.requestFullAccessToReminders { ok, _ in granted = ok; sem.signal() }
    sem.wait()
    if !granted { fail("Reminders access denied. Allow Obsidian in System Settings → Privacy & Security → Reminders.") }
}

func calendar(titled title: String, create: Bool) throws -> EKCalendar? {
    let wanted = title.lowercased()
    if let cal = store.calendars(for: .reminder).first(where: { $0.title.lowercased() == wanted }) { return cal }
    guard create else { return nil }
    let cal = EKCalendar(for: .reminder, eventStore: store)
    cal.title = title
    guard let source = store.defaultCalendarForNewReminders()?.source else { fail("No Reminders account found.") }
    cal.source = source
    try store.saveCalendar(cal, commit: true)
    return cal
}

func fetchOpen(in cal: EKCalendar) -> [EKReminder] {
    let sem = DispatchSemaphore(value: 0)
    var result: [EKReminder] = []
    let predicate = store.predicateForIncompleteReminders(withDueDateStarting: nil, ending: nil, calendars: [cal])
    store.fetchReminders(matching: predicate) { rs in result = rs ?? []; sem.signal() }
    sem.wait()
    return result
}

let input = FileHandle.standardInput.readDataToEndOfFile()
guard CommandLine.arguments.count > 1 else { fail("usage: reminders-bridge read|apply < input.json") }
requestAccess()

switch CommandLine.arguments[1] {
case "read":
    guard let req = try? JSONDecoder().decode(ReadIn.self, from: input) else { fail("bad input") }
    var out = ReadOut()
    var seen = Set<String>()
    for (area, title) in req.lists {
        guard let cal = try calendar(titled: title, create: false) else { out.lists[area] = []; continue }
        let rs = fetchOpen(in: cal).map(rem)
        rs.forEach { seen.insert($0.id) }
        out.lists[area] = rs
    }
    for id in req.ids where !seen.contains(id) {
        if let r = store.calendarItem(withIdentifier: id) as? EKReminder { out.byId[id] = rem(r) } else { out.missing.append(id) }
    }
    emit(out)

case "apply":
    guard let req = try? JSONDecoder().decode(ApplyIn.self, from: input) else { fail("bad input") }
    var out = ApplyOut()
    var created: [(String, EKReminder)] = []
    for c in req.create {
        do {
            guard let cal = try calendar(titled: c.list, create: true) else { continue }
            let r = EKReminder(eventStore: store)
            r.title = c.name
            r.calendar = cal
            if let due = c.due { r.dueDateComponents = components(due) }
            try store.save(r, commit: false)
            created.append((c.uid, r))
        } catch { out.errors.append("create \(c.name): \(error.localizedDescription)") }
    }
    for u in req.update {
        guard let r = store.calendarItem(withIdentifier: u.id) as? EKReminder else { out.errors.append("missing \(u.id)"); continue }
        if let name = u.name { r.title = name }
        if u.clearDue == true { r.dueDateComponents = nil } else if let due = u.due { r.dueDateComponents = components(due) }
        if let done = u.completed { r.isCompleted = done }
        do { try store.save(r, commit: false) } catch { out.errors.append("update \(r.title ?? u.id): \(error.localizedDescription)") }
    }
    do { try store.commit() } catch { fail("commit failed: \(error.localizedDescription)") }
    for (uid, r) in created { out.created[uid] = r.calendarItemIdentifier }
    emit(out)

default:
    fail("unknown command \(CommandLine.arguments[1])")
}
