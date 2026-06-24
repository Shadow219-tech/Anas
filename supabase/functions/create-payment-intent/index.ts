import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OWNER_EMAIL = "ezzine.anas21@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe non configuré. Ajoutez votre clé STRIPE_SECRET_KEY." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const {
      orderId,
      orderNumber,
      amount,
      currency,
      customerEmail,
      customerName,
      items,
      shippingAddress,
    } = body;

    // Create Stripe Payment Intent (for Stripe Elements in-page payment)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || "eur",
      payment_method_types: ["card", "paypal"],
      receipt_email: customerEmail,
      metadata: {
        order_id: orderId,
        order_number: orderNumber,
        customer_name: customerName,
      },
      description: `Orygin Order ${orderNumber}`,
    });

    // Update order record with payment intent id
    await supabase
      .from("orders")
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        stripe_payment_status: "requires_payment_method",
      })
      .eq("id", orderId);

    // Send notification email to owner via Resend (non-blocking)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const totalEur = (amount / 100).toFixed(2);
      const itemsHtml = items
        .map((i: any) => `
          <tr>
            <td style="padding:10px 14px;border-bottom:1px solid #1a1a1a;color:#aaa;font-size:13px;font-family:Georgia,serif;font-style:italic">${i.product_name}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #1a1a1a;color:#888;font-size:12px">${i.country_name}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #1a1a1a;color:#888;font-size:12px">${i.size}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #1a1a1a;color:#888;font-size:12px">×${i.quantity}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #1a1a1a;color:#c9a84c;font-size:13px;font-family:Georgia,serif;font-style:italic">${i.unit_price * i.quantity} €</td>
          </tr>`)
        .join("");

      const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#080808;margin:0;padding:40px 20px;font-family:Montserrat,sans-serif;font-weight:300">
  <div style="max-width:580px;margin:0 auto">
    
    <!-- Header -->
    <div style="text-align:center;padding:40px 0 32px;border-bottom:0.5px solid #1a1a1a;margin-bottom:32px">
      <p style="color:#a07830;font-size:9px;letter-spacing:6px;margin:0 0 12px">✦ ORYGIN · GLOBAL STREET CULTURE</p>
      <h1 style="color:#c9a84c;font-family:Georgia,serif;font-style:italic;font-size:42px;margin:0;font-weight:300">Nouvelle commande</h1>
    </div>

    <!-- Order number -->
    <div style="background:#0d0d0d;border:0.5px solid #1a1a1a;padding:24px;margin-bottom:16px">
      <p style="color:#a07830;font-size:8px;letter-spacing:5px;margin:0 0 10px">RÉFÉRENCE</p>
      <p style="color:#fff;font-family:Georgia,serif;font-style:italic;font-size:22px;margin:0">${orderNumber}</p>
    </div>

    <!-- Customer info -->
    <div style="background:#0d0d0d;border:0.5px solid #1a1a1a;padding:24px;margin-bottom:16px">
      <p style="color:#a07830;font-size:8px;letter-spacing:5px;margin:0 0 14px">CLIENT</p>
      <p style="color:#fff;margin:0 0 6px;font-size:14px">${customerName}</p>
      <p style="color:#888;margin:0 0 4px;font-size:13px">${customerEmail}</p>
      ${shippingAddress ? `<p style="color:#888;margin:8px 0 0;font-size:13px;line-height:1.6">
        ${shippingAddress.street}<br>
        ${shippingAddress.postal_code} ${shippingAddress.city}<br>
        ${shippingAddress.country}
      </p>` : ""}
    </div>

    <!-- Items -->
    <div style="background:#0d0d0d;border:0.5px solid #1a1a1a;padding:24px;margin-bottom:16px">
      <p style="color:#a07830;font-size:8px;letter-spacing:5px;margin:0 0 16px">ARTICLES COMMANDÉS</p>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 14px;color:#555;font-size:8px;letter-spacing:3px;font-weight:400;border-bottom:0.5px solid #2a2a2a">ARTICLE</th>
            <th style="text-align:left;padding:8px 14px;color:#555;font-size:8px;letter-spacing:3px;font-weight:400;border-bottom:0.5px solid #2a2a2a">PAYS</th>
            <th style="text-align:left;padding:8px 14px;color:#555;font-size:8px;letter-spacing:3px;font-weight:400;border-bottom:0.5px solid #2a2a2a">TAILLE</th>
            <th style="text-align:left;padding:8px 14px;color:#555;font-size:8px;letter-spacing:3px;font-weight:400;border-bottom:0.5px solid #2a2a2a">QTÉ</th>
            <th style="text-align:left;padding:8px 14px;color:#555;font-size:8px;letter-spacing:3px;font-weight:400;border-bottom:0.5px solid #2a2a2a">PRIX</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="background:#0d0d0d;border:0.5px solid #1a1a1a;padding:24px;text-align:right;margin-bottom:32px">
      <p style="color:#a07830;font-size:8px;letter-spacing:5px;margin:0 0 8px">TOTAL COMMANDE</p>
      <p style="color:#c9a84c;font-family:Georgia,serif;font-style:italic;font-size:36px;margin:0">${totalEur} €</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:0.5px solid #111">
      <p style="color:#222;font-size:8px;letter-spacing:4px;margin:0">ORYGIN · GLOBAL STREET CULTURE · DROP 001</p>
    </div>
  </div>
</body>
</html>`;

      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Orygin <commandes@orygin.com>",
          to: [OWNER_EMAIL],
          subject: `✦ Commande ${orderNumber} — ${totalEur} € — ${customerName}`,
          html: emailHtml,
        }),
      }).catch(console.error);
    }

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("create-payment-intent error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
