"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown, LockKeyhole, UnlockKeyhole } from "lucide-react";
import { useState } from "react";

type VaultProduct = { name: string; slug: string; image: string; type: string; price: string };
type Props = { onOpen?: () => void; debugOpenAtMsFromNow?: number; products?: readonly VaultProduct[] };

function DoorWheel() {
  return (
    <div className="absolute left-1/2 top-1/2 aspect-square w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-[#25241f] bg-[#0c0c0a] shadow-[0_0_0_2px_rgba(229,161,43,.55),0_0_0_14px_#11110e,0_20px_55px_#000] sm:w-64 lg:w-80">
      <div className="absolute inset-[16%] rounded-full border border-[#e5a12b]/40 vault-metal" />
      {[0, 45, 90, 135].map(angle => <span key={angle} className="absolute left-1/2 top-1/2 h-2 w-[78%] -translate-x-1/2 -translate-y-1/2 bg-[#363328] shadow-[0_0_0_1px_rgba(255,215,0,.35)]" style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }} />)}
      <div className="absolute inset-[34%] flex items-center justify-center rounded-full border-2 border-[#e5a12b]/60 bg-[#11100d] shadow-[inset_0_0_22px_#000]"><Crown className="h-9 w-9 text-[#e5a12b] sm:h-12 sm:w-12" strokeWidth={1.25} /></div>
    </div>
  );
}

export function VaultDoors({ onOpen, products = [] }: Props) {
  const [open, setOpen] = useState(false);
  const unlock = () => { setOpen(true); onOpen?.(); };
  const enter = () => document.getElementById("vault-collection")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="relative isolate min-h-[850px] overflow-hidden border-y border-[#e5a12b]/30 bg-[#050504] lg:min-h-[calc(100svh-104px)]">
      <div className="absolute inset-0 vault-grid opacity-45" />
      <div className="absolute inset-x-0 top-0 h-14 border-b border-[#e5a12b]/25 bg-[#10100d] shadow-[0_18px_50px_#000]" />
      <div className="absolute inset-x-[3%] bottom-[4%] top-[5%] overflow-hidden border-[10px] border-[#1c1b17] bg-[#080807] shadow-[0_0_0_1px_rgba(255,215,0,.45),inset_0_0_90px_#000,0_35px_120px_#000] sm:inset-x-[5%] lg:inset-x-[7%]">
        <div className="absolute inset-5 border border-[#e5a12b]/15" />
        <div className="absolute inset-x-[7%] bottom-[8%] top-[8%] border border-[#e5a12b]/20 bg-[#0b0b09] shadow-[inset_0_0_80px_#000]" />
        <div className={`absolute bottom-[8%] left-[7%] right-[7%] top-[8%] origin-left overflow-hidden border border-[#e5a12b]/35 bg-[#12120f] shadow-[inset_0_0_100px_#050504,16px_0_45px_#000] transition-transform duration-[1500ms] ease-[cubic-bezier(.22,.8,.2,1)] ${open ? "-translate-x-[115%] -rotate-y-12" : "translate-x-0"}`}>
          <div className="absolute inset-5 border border-[#e5a12b]/15" />
          {[17, 50, 83].map(top => <span key={top} className="absolute left-0 h-px w-full bg-[#e5a12b]/15" style={{ top: `${top}%` }} />)}
          {[15, 85].map(left => <span key={left} className="absolute top-0 h-full w-px bg-[#e5a12b]/15" style={{ left: `${left}%` }} />)}
          <DoorWheel />
        </div>
      </div>

      <div className="relative z-20 mx-auto flex min-h-[850px] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:min-h-[calc(100svh-104px)] lg:px-8">
        {!open ? (
          <div className="max-w-4xl bg-black/55 px-4 py-8 backdrop-blur-[2px] sm:px-10">
            <p className="eyebrow">The High Society stash</p>
            <h1 className="mt-4 text-5xl font-medium leading-[1.03] text-white sm:text-7xl lg:text-[5.5rem]">Kick back.<br /><span className="text-[#e5a12b]">We saved you a seat.</span></h1>
            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-zinc-300">Fresh flower, loud flavors, and the kind of drops worth pausing the game for. Come through and see what&apos;s in the vault.</p>
            <button onClick={unlock} aria-expanded={open} className="mt-9 inline-flex h-14 items-center gap-3 border border-[#e5a12b] bg-black/80 px-7 text-sm font-semibold text-[#e5a12b] shadow-[0_0_38px_rgba(255,215,0,.16)] transition hover:bg-[#e5a12b] hover:text-black"><LockKeyhole className="h-4 w-4" /> Crack the vault</button>
          </div>
        ) : (
          <div className="w-full max-w-4xl animate-[vaultReveal_700ms_ease-out_both] bg-black/65 px-3 py-7 backdrop-blur-sm sm:px-8">
            <UnlockKeyhole className="mx-auto h-9 w-9 text-[#ffc263] drop-shadow-[0_0_15px_rgba(255,215,0,.5)]" />
            <p className="mt-3 text-3xl font-medium text-white sm:text-4xl">You&apos;re in. Pick something proper.</p>
            {products.length > 0 && <div className="mx-auto mt-7 grid max-w-3xl grid-cols-3 gap-2 sm:gap-4">{products.map(product => <Link key={product.slug} href={`/products/${product.slug}`} className="group min-w-0 border border-[#e5a12b]/35 bg-black/90 p-2 text-left sm:p-3"><div className="relative aspect-square overflow-hidden bg-[#11100d]"><Image src={product.image} alt={product.name} fill sizes="(max-width:640px) 28vw,190px" className="object-cover transition duration-500 group-hover:scale-105" /></div><p className="mt-2 truncate text-[10px] uppercase text-[#e5a12b] sm:text-xs">{product.type}</p><p className="mt-1 line-clamp-2 min-h-8 text-xs font-medium text-white sm:min-h-10 sm:text-sm">{product.name}</p><p className="mt-2 text-xs text-zinc-300 sm:text-sm">{product.price}</p></Link>)}</div>}
            <button type="button" onClick={enter} className="mt-7 inline-flex h-11 touch-manipulation items-center gap-2 bg-[#e5a12b] px-5 text-sm font-semibold text-black transition hover:bg-[#ffc263]">See what&apos;s fresh <ArrowRight className="h-4 w-4" /></button>
          </div>
        )}
      </div>
    </section>
  );
}
