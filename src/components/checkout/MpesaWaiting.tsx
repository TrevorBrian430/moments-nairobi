"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export interface MpesaWaitingProps {
  orderNumber: string;
  phone: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MpesaWaiting({
  orderNumber,
  phone,
  amount,
  onSuccess,
  onCancel,
}: MpesaWaitingProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(90);
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      setIsTimedOut(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const handleRetry = () => {
    setSecondsRemaining(90);
    setIsTimedOut(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="M-Pesa payment prompt"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/70 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-md bg-white border border-[#E4E0D8] rounded-[2px] p-6 text-center space-y-5 animate-fade-in shadow-xl">
        {!isTimedOut ? (
          <>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 text-[#BB4C6C] animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#111111]">
                Check your phone
              </h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                An M-Pesa prompt has been sent to{" "}
                <strong className="text-[#111111]">{phone}</strong>. Enter your
                M-Pesa PIN to complete payment of KES{" "}
                {amount.toLocaleString("en-KE")}.
              </p>
            </div>

            <div className="text-xs font-mono text-[#6B6B66] bg-[#F6F4F0] py-2 rounded-[2px]">
              Waiting for confirmation: {secondsRemaining}s
            </div>

            <p className="text-[11px] text-[#6B6B66]">
              Order #{orderNumber}
            </p>

            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-[#6B6B66] hover:text-[#111111] transition-colors underline underline-offset-2"
            >
              Pay another way
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#B3261E]">
                Payment request timed out
              </h3>
              <p className="text-xs text-[#6B6B66] leading-relaxed">
                We did not receive a confirmation PIN response within 90 seconds.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleRetry}
                className="w-full h-[44px] rounded-[2px] bg-[#BB4C6C] hover:bg-[#9A3E58] text-white text-xs font-medium transition-colors"
              >
                Retry M-Pesa prompt
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full h-[44px] rounded-[2px] border border-[#E4E0D8] bg-white text-xs text-[#111111] hover:border-[#6B6B66] transition-colors"
              >
                Pay another way
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
