import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, rating, category, message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Feedback message cannot be empty." },
        { status: 400 }
      );
    }

    // 1. Save feedback to Supabase if configured
    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.from("feedback").insert([
          {
            name: name || "Anonymous User",
            email: email || null,
            rating: rating || 5,
            category: category || "General",
            message: message.trim(),
          },
        ]);
      } catch (dbErr) {
        console.warn("Supabase feedback insertion error:", dbErr);
      }
    }

    // 2. Send email notification via SMTP if configured
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465, // true for 465, false for 587
          auth: {
            user,
            pass,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_FROM || user,
          to: user,
          subject: `[NetPulse Feedback] New ${category || "General"} Feedback (${rating || 5} Stars)`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
              <h2 style="color: #0891b2; margin-top: 0;">New User Feedback Received</h2>
              <p><strong>Category:</strong> ${category || "General"}</p>
              <p><strong>Rating:</strong> ${"⭐".repeat(rating || 5)} (${rating || 5}/5)</p>
              <p><strong>Name:</strong> ${name || "Anonymous User"}</p>
              <p><strong>Email:</strong> ${email || "Not provided"}</p>
              <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
              <p style="font-size: 14px; line-height: 1.6; color: #1e293b; background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                "${message.trim().replace(/\n/g, "<br>")}"
              </p>
              <p style="font-size: 11px; color: #64748b; margin-top: 20px;">Sent via NetPulse Internet Speed Test App</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.warn("SMTP email notification error:", mailErr);
      }
    }

    return NextResponse.json(
      { ok: true, message: "Thank you! Your feedback has been received." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to process feedback." },
      { status: 500 }
    );
  }
}
