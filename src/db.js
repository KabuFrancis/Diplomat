import Dexie from 'dexie';

export const db = new Dexie('DiplomatDB');

db.version(1).stores({
  invoices: '++id, customerName, amount, dueDate, status, lastContacted, diplomacyLevel'
});

// Seed data for immediate impact
export async function seedDatabase() {
  const count = await db.invoices.count();
  if (count === 0) {
    await db.invoices.bulkAdd([
      {
        customerName: 'Acme Corp',
        amount: 4500,
        dueDate: '2026-04-10',
        status: 'overdue',
        lastContacted: '2026-04-15',
        diplomacyLevel: 1
      },
      {
        customerName: 'Global Logistics',
        amount: 12000,
        dueDate: '2026-03-25',
        status: 'overdue',
        lastContacted: '2026-04-20',
        diplomacyLevel: 3
      },
      {
        customerName: 'TechFlow Systems',
        amount: 2800,
        dueDate: '2026-04-20',
        status: 'pending',
        lastContacted: null,
        diplomacyLevel: 0
      }
    ]);
  }
}
