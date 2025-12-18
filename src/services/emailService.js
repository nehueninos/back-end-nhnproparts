import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarPedidoEmail = async (orderData) => {
  const itemsList = orderData.items
    .map(
      (item) =>
        `<li>${item.name} x${item.quantity} = $${(
          item.price * item.quantity
        ).toFixed(2)}</li>`
    )
    .join('');

  const emailHtml = `
    <h1>🏍️ Nuevo Pedido</h1>
    <p><b>Pedido:</b> ${orderData.orderId}</p>

    <h3>👤 Cliente</h3>
    <ul>
      <li><b>Nombre:</b> ${orderData.customerName}</li>
      <li><b>Email:</b> ${orderData.customerEmail}</li>
      <li><b>Teléfono:</b> ${orderData.customerPhone}</li>
      <li><b>Dirección:</b> ${orderData.customerAddress}</li>
    </ul>

    <h3>📦 Productos</h3>
    <ul>${itemsList}</ul>

    <h3>🚚 Envío seleccionado</h3>
    <ul>
      <li><b>Método:</b> ${orderData.shipping.method}</li>
      <li><b>Costo:</b> $${orderData.shipping.price.toLocaleString()}</li>
      <li><b>Entrega estimada:</b> ${orderData.shipping.estimated}</li>
    </ul>

    <hr />

    <h2>💰 Total del pedido: $${orderData.total.toLocaleString()}</h2>
  `;

  return await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO, // 👈 SIEMPRE A VOS
    subject: `🏍️ Nuevo pedido #${orderData.orderId.slice(0, 8)}`,
    html: emailHtml,
  });
};
