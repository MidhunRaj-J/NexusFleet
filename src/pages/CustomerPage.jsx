import { AnimatedNumber } from '../components/AnimatedNumber';
import { PageShell } from '../components/PageShell';

export function CustomerPage({
  role,
  orderForm,
  setOrderForm,
  createOrder,
  orders,
  bestMatch,
  candidateTravelers,
  dynamicPrice,
  restrictedCheck,
  notifications,
  reviews,
  reviewDraft,
  setReviewDraft,
  submitReview,
  chatDraft,
  setChatDraft,
  sendChatMessage,
  messages,
  complaintForm,
  setComplaintForm,
  openDispute,
  itemCategories,
  urgencyOptions,
  timeWindows,
}) {
  const latestOrder = orders[0];

  return (
    <PageShell
      role={role}
      eyebrow="CUSTOMER WORKSPACE"
      title="Order creation, matching, booking, chat, and verification live here"
      subtitle="This page now covers the full customer journey from shipment details to traveler matching and post-delivery review."
      actions={(
        <div className="hero-metrics">
          <div><strong>₹<AnimatedNumber value={dynamicPrice} decimals={0} /></strong><span>Price</span></div>
          <div><strong><AnimatedNumber value={bestMatch.score} />%</strong><span>Match</span></div>
          <div><strong>{restrictedCheck.allowed ? 'Clear' : 'Review'}</strong><span>Validation</span></div>
        </div>
      )}
    >
      <div className="grid split">
        <form className="card form-card" onSubmit={createOrder}>
          <h2>Create delivery order</h2>
          <div className="form-grid">
            <input placeholder="Pickup location" value={orderForm.pickup} onChange={(event) => setOrderForm((current) => ({ ...current, pickup: event.target.value }))} />
            <input placeholder="Drop location" value={orderForm.drop} onChange={(event) => setOrderForm((current) => ({ ...current, drop: event.target.value }))} />
            <select value={orderForm.itemCategory} onChange={(event) => setOrderForm((current) => ({ ...current, itemCategory: event.target.value }))}>
              {itemCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input placeholder="Item name" value={orderForm.itemName} onChange={(event) => setOrderForm((current) => ({ ...current, itemName: event.target.value }))} />
            <input type="number" min="1" placeholder="Weight (kg)" value={orderForm.weight} onChange={(event) => setOrderForm((current) => ({ ...current, weight: Number(event.target.value) }))} />
            <input type="number" min="1" placeholder="Distance (km)" value={orderForm.distance} onChange={(event) => setOrderForm((current) => ({ ...current, distance: Number(event.target.value) }))} />
            <input type="number" min="1" placeholder="Capacity needed" value={orderForm.capacity} onChange={(event) => setOrderForm((current) => ({ ...current, capacity: Number(event.target.value) }))} />
            <input type="number" min="1" placeholder="Length (cm)" value={orderForm.length} onChange={(event) => setOrderForm((current) => ({ ...current, length: Number(event.target.value) }))} />
            <input type="number" min="1" placeholder="Width (cm)" value={orderForm.width} onChange={(event) => setOrderForm((current) => ({ ...current, width: Number(event.target.value) }))} />
            <input type="number" min="1" placeholder="Height (cm)" value={orderForm.height} onChange={(event) => setOrderForm((current) => ({ ...current, height: Number(event.target.value) }))} />
            <input type="text" placeholder="Special instructions" value={orderForm.specialInstructions} onChange={(event) => setOrderForm((current) => ({ ...current, specialInstructions: event.target.value }))} />
            <input type="url" placeholder="Item image URL" value={orderForm.itemImage} onChange={(event) => setOrderForm((current) => ({ ...current, itemImage: event.target.value }))} />
            <select value={orderForm.urgency} onChange={(event) => setOrderForm((current) => ({ ...current, urgency: event.target.value }))}>
              {urgencyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <select value={orderForm.timeWindow} onChange={(event) => setOrderForm((current) => ({ ...current, timeWindow: event.target.value }))}>
              {timeWindows.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <input type="time" value={orderForm.flexibleWindow} onChange={(event) => setOrderForm((current) => ({ ...current, flexibleWindow: event.target.value }))} />
            <input type="number" min="0" placeholder="Manual bid" value={orderForm.manualBid} onChange={(event) => setOrderForm((current) => ({ ...current, manualBid: Number(event.target.value) }))} />
          </div>
          <div className={`validation-pill ${restrictedCheck.allowed ? 'ok' : 'warn'}`}>
            {restrictedCheck.reason}
          </div>
          <div className="metrics">
            <p>Dynamic Price: <strong>₹{dynamicPrice.toFixed(0)}</strong></p>
            <p>Best Traveler: <strong>{bestMatch.name}</strong></p>
            <p>Match Score: <strong>{bestMatch.score}%</strong></p>
            <p>ETA: <strong>{bestMatch.eta} mins</strong></p>
          </div>
          <button type="submit">Create Order and Lock Escrow</button>
        </form>

        <article className="card panel-card">
          <span className="panel-label">Matching engine</span>
          <h2>Recommended travelers</h2>
          <ul className="list compact admin-list">
            {candidateTravelers.slice(0, 3).map((traveler) => (
              <li key={traveler.id}>
                <div>
                  <strong>{traveler.name}</strong>
                  <span>Score {traveler.score}% • ETA {traveler.eta} mins • {traveler.transportType}</span>
                </div>
                <span className={traveler.availability ? 'status-badge ok' : 'status-badge warn'}>{traveler.availability ? 'Available' : 'Offline'}</span>
              </li>
            ))}
          </ul>
          <div className="status-stack">
            <div className="status-row"><span>Notifications</span><strong>{notifications.length}</strong></div>
            <div className="status-row"><span>Customer reviews</span><strong>{reviews.length}</strong></div>
            <div className="status-row"><span>Latest order</span><strong>{latestOrder ? latestOrder.id : 'None'}</strong></div>
          </div>
        </article>
      </div>

      <div className="grid split bottom-grid">
        <article className="card panel-card">
          <span className="panel-label">Chat</span>
          <h2>Customer and traveler messages</h2>
          <div className="chat-box">
            {messages.slice(0, 4).map((message) => (
              <div key={message.id} className="chat-message">
                <strong>{message.sender}</strong>
                <span>{message.text}</span>
              </div>
            ))}
          </div>
          <div className="quick-message-row">
            <button type="button" className="mini ghost" onClick={() => setChatDraft('Please confirm pickup time.')}>Quick message</button>
            <button type="button" className="mini ghost" onClick={() => setChatDraft('Share your live ETA.')}>Ask ETA</button>
          </div>
          <textarea value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} placeholder="Type a message" />
          <button type="button" onClick={sendChatMessage}>Send message</button>
        </article>

        <article className="card panel-card">
          <span className="panel-label">Review & disputes</span>
          <h2>Rate, review, and raise complaints</h2>
          <div className="form-grid single-column">
            <input type="number" min="1" max="5" value={reviewDraft.rating} onChange={(event) => setReviewDraft((current) => ({ ...current, rating: Number(event.target.value) }))} />
            <textarea value={reviewDraft.comment} onChange={(event) => setReviewDraft((current) => ({ ...current, comment: event.target.value }))} placeholder="Review comment" />
          </div>
          <button type="button" className="ghost" onClick={() => submitReview(orders[0]?.id)}>Submit review</button>
          <div className="form-grid single-column">
            <select value={complaintForm.issueType} onChange={(event) => setComplaintForm((current) => ({ ...current, issueType: event.target.value }))}>
              {['Late delivery', 'Damaged item', 'Fraud', 'Traveler cancellation', 'Customer cancellation'].map((issue) => <option key={issue} value={issue}>{issue}</option>)}
            </select>
            <input placeholder="Evidence URL" value={complaintForm.evidence} onChange={(event) => setComplaintForm((current) => ({ ...current, evidence: event.target.value }))} />
            <textarea placeholder="Complaint details" value={complaintForm.description} onChange={(event) => setComplaintForm((current) => ({ ...current, description: event.target.value }))} />
          </div>
          <button type="button" className="ghost" onClick={() => openDispute(orders[0]?.id)}>Raise complaint</button>
        </article>
      </div>
    </PageShell>
  );
}
