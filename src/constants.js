// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  🔐 STEP 2: Change the admin password below!
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const ADMIN_PASSWORD = 'luxegrid2026';

export const WHATSAPP = '919897780749';

export const LOGO_URL =
  'https://scontent.fdel65-2.fna.fbcdn.net/v/t1.15752-9/622542543_1815622072486427_2799502405856360901_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=0024fc&_nc_ohc=ccummfe07SIQ7kNvwHrBAIg&_nc_oc=AdmxBtGBv1sxvDUuSBlqvKk4dqZPisetoILdevnpOGjEjMB3IUi0pO8MSICItdjyR97yAR911YCS7WqYKYtv4Tg8&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=scontent.fdel65-2.fna&oh=03_Q7cD4gEk_1z_0f3AsW5jIe0bG-Zb9lNwbxVK-lizlDrt5OH63g&oe=69AE0ACB';

export const fallbackImg = (name = 'Product') =>
  `https://placehold.co/400x533/f0e8d8/C6A75E?text=${encodeURIComponent(name)}`;

export const buildWhatsAppMsg = (items, customer, total) =>
  encodeURIComponent(
    `Hello Luxe Grid India! 🛍\n\nOrder from *${customer.name || 'Customer'}*\n\n` +
    items.map(i => `• ${i.name} ×${i.qty} = ₹${i.price * i.qty}`).join('\n') +
    `\n\n*Total: ₹${total}*\n\nDeliver to:\n${customer.address || ''}\nPhone: ${customer.phone || ''}`
  );

export const fmtDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
