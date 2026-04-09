import { PageShell } from '../components/PageShell';

export function PaymentsPage({ role, orders, transactions, wallet, setWallet, addPayment, addRefund }) {
  return (
    <PageShell
      role={role}
      eyebrow="PAYMENTS"
      title="Booking payments, escrow, and earnings sit on their own page"
      subtitle="Manage customer checkout, traveler earnings, escrow flow, and refunds in one payments workspace."
    >
      <div className="grid split">
        <form className="card form-card" onSubmit={addPayment}>
          <h2>Pay at booking</h2>
          <select value={wallet.method} onChange={(event) => setWallet((current) => ({ ...current, method: event.target.value }))}>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Wallet">Wallet</option>
          </select>
          <input
            type="number"
            min="1"
            placeholder="Amount"
            value={wallet.amount}
            onChange={(event) => setWallet((current) => ({ ...current, amount: Number(event.target.value) }))}
          />
          <button type="submit">Capture Payment</button>
          <div className="status-stack">
            <div className="status-row"><span>Escrow holding</span><strong>Active</strong></div>
            <div className="status-row"><span>Platform wallet</span><strong>₹{wallet.walletBalance}</strong></div>
            <div className="status-row"><span>Traveler balance</span><strong>₹{wallet.travelerBalance}</strong></div>
          </div>
        </form>

        <article className="card panel-card">
          <span className="panel-label">Transactions</span>
          <h2>Payment history</h2>
          <ul className="list compact admin-list">
            {transactions.length === 0 && <li>No transactions yet.</li>}
            {transactions.map((transaction) => (
              <li key={transaction.id}>
                <div>
                  <strong>{transaction.id}</strong>
                  <span>{transaction.type} • ₹{transaction.amount} • {transaction.status}</span>
                </div>
                {transaction.type === 'payment' && <button type="button" className="mini" onClick={() => addRefund(transaction.amount)}>Refund</button>}
              </li>
            ))}
          </ul>
          <p>{orders.length} orders are connected to this payment flow.</p>
        </article>
      </div>
    </PageShell>
  );
}
