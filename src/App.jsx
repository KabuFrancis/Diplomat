import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';
import { 
  DollarSign, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Briefcase,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Upload,
  FileSpreadsheet
} from 'lucide-react';

const DIPLOMACY_LEVELS = [
  { level: 0, label: 'Standard Reminder', color: 'var(--accent-secondary)', description: 'A polite notification that the due date has passed.' },
  { level: 1, label: 'Gentle Inquiry', color: 'var(--accent-primary)', description: 'Checking in to ensure there were no technical issues with the invoice.' },
  { level: 2, label: 'Formal Follow-up', color: 'var(--accent-warm)', description: 'A structured reminder regarding standard payment terms.' },
  { level: 3, label: 'Urgent Mediation', color: 'var(--accent-danger)', description: 'A firm request for payment to avoid service interruption.' }
];

export default function App() {
  const invoices = useLiveQuery(() => db.invoices.toArray()) || [];
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.status === 'overdue' ? inv.amount : 0), 0);
  const recoveredAmount = 14200; // Mock stat for UI

  const handleNudge = async (invoice) => {
    const nextLevel = Math.min(invoice.diplomacyLevel + 1, 3);
    await db.invoices.update(invoice.id, {
      diplomacyLevel: nextLevel,
      lastContacted: new Date().toISOString().split('T')[0],
      status: 'overdue'
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const newInvoices = results.data.map(row => {
          // Robust mapping for common header variations
          const customerName = row['Customer Name'] || row['Customer'] || row['Client'] || row['Name'];
          const amount = parseFloat((row['Amount'] || row['Total'] || row['Balance'] || '0').replace(/[^0-9.-]+/g,""));
          const dueDate = row['Due Date'] || row['Due'] || row['Date'] || new Date().toISOString().split('T')[0];

          return {
            customerName: customerName || 'Unknown Customer',
            amount: isNaN(amount) ? 0 : amount,
            dueDate: dueDate,
            status: 'overdue',
            lastContacted: null,
            diplomacyLevel: 0
          };
        });

        await db.invoices.bulkAdd(newInvoices);
        setIsImporting(false);
      },
      error: (error) => {
        console.error("CSV Parse Error:", error);
        setIsImporting(false);
      }
    });
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="mb-12 flex justify-between items-end flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            <ShieldCheck size={14} className="text-[var(--accent-primary)]" />
            <span>Diplomat Intelligence Brief</span>
          </div>
          <h1>Accounts Recoverable</h1>
          <p className="text-[var(--text-dim)] italic font-serif">Automated, professional collection strategy.</p>
        </div>
        
        <div className="flex gap-4 items-end">
          <label className="group flex flex-col items-center justify-center glass px-6 py-4 rounded-2xl border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--accent-primary)]/50 transition-all">
            <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">Import List</div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Upload size={14} className="text-[var(--text-dim)]" />
              <span>{isImporting ? 'Parsing...' : 'CSV Upload'}</span>
            </div>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <StatCard label="Outstanding" value={`$${totalOutstanding.toLocaleString()}`} color="var(--accent-danger)" />
          <StatCard label="Recovered (30d)" value={`$${recoveredAmount.toLocaleString()}`} color="var(--accent-primary)" />
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Invoice List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)]">Active Chases</h3>
            <span className="text-xs text-[var(--text-muted)]">{invoices.length} entries tracked</span>
          </div>
          <AnimatePresence>
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`glass p-6 rounded-2xl border cursor-pointer card-shine transition-all ${
                    selectedInvoice?.id === inv.id ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl mb-1">{inv.customerName}</h4>
                      <div className="flex gap-4 text-xs text-[var(--text-dim)]">
                        <span className="flex items-center gap-1 font-mono uppercase"><DollarSign size={12} /> {inv.amount.toLocaleString()}</span>
                        <span className="flex items-center gap-1 font-mono uppercase"><Clock size={12} /> Due {inv.dueDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                        inv.status === 'overdue' ? 'bg-[var(--accent-danger)]/10 text-[var(--accent-danger)]' : 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                      }`}>
                        {inv.status}
                      </span>
                      <div className="mt-2 text-[10px] text-[var(--text-muted)] uppercase tracking-tighter">
                        Level {inv.diplomacyLevel}: {DIPLOMACY_LEVELS[inv.diplomacyLevel].label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center glass rounded-3xl border-dashed border-2 border-[var(--border-subtle)]">
                <FileSpreadsheet size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-20" />
                <p className="text-[var(--text-dim)]">No invoices found. Import a CSV to begin.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-4">Diplomacy Command</h3>
          
          {selectedInvoice ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-3xl sticky top-8"
            >
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider mb-1">Current Strategy</p>
                <p className="text-lg font-bold" style={{ color: DIPLOMACY_LEVELS[selectedInvoice.diplomacyLevel].color }}>
                  {DIPLOMACY_LEVELS[selectedInvoice.diplomacyLevel].label}
                </p>
              </div>

              <p className="text-sm text-[var(--text-dim)] mb-8 leading-relaxed italic font-serif">
                "{DIPLOMACY_LEVELS[selectedInvoice.diplomacyLevel].description}"
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => handleNudge(selectedInvoice)}
                  className="w-full p-4 rounded-xl flex items-center justify-center gap-2 bg-[var(--accent-primary)] text-black font-bold hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--accent-primary)]/20"
                >
                  <Send size={18} />
                  <span>Send Diplomatic Nudge</span>
                </button>
                
                <button className="w-full p-4 rounded-xl flex items-center justify-center gap-2 border border-[var(--border-subtle)] text-[var(--text-dim)] hover:bg-white/5 transition-colors">
                  <MessageSquare size={18} />
                  <span>Edit Response Template</span>
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
                <div className="flex justify-between text-[10px] uppercase tracking-wider mb-2">
                  <span className="text-[var(--text-muted)]">Last Pulse</span>
                  <span>{selectedInvoice.lastContacted || 'Initial State'}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-wider">
                  <span className="text-[var(--text-muted)]">Recovery Confidence</span>
                  <span className="text-[var(--accent-primary)]">84%</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-[var(--border-subtle)] bg-transparent">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="text-[var(--text-muted)]" />
              </div>
              <p className="text-sm text-[var(--text-muted)]">Select an active chase to initiate diplomatic action.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="glass px-6 py-4 rounded-2xl border border-[var(--border-subtle)] min-w-[140px]">
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1">{label}</div>
      <div className="text-xl font-bold font-mono" style={{ color }}>{value}</div>
    </div>
  );
}
