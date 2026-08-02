'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { DeliveryZone, Order, OrderItem, PaymentMethod } from '@/types';
import { createOrder } from '@/lib/api/orders';
import { getDeliveryZones } from '@/lib/api/delivery-zones';
import { formatPrice } from '@/lib/format';

type SubmitState = 'idle' | 'submitting' | 'wave-redirect' | 'success';

const MOCK_PROMO_CODES = new Set(['BIENVENUE10', 'WELCOME']);

const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:border-accent focus:outline-none dark:border-zinc-700';

export function OrderForm({ items }: { items: OrderItem[] }) {
  const [customerName, setCustomerName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone1Touched, setPhone1Touched] = useState(false);
  const [phone2, setPhone2] = useState('');
  const [city, setCity] = useState('Abidjan');
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [deliveryZoneId, setDeliveryZoneId] = useState('');
  const [district, setDistrict] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDeliveryZones()
      .then(setDeliveryZones)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : 'Impossible de charger les zones de livraison.',
        );
      });
  }, []);

  const selectedZone = deliveryZones.find((zone) => zone.id === deliveryZoneId) ?? null;
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = selectedZone?.fee ?? 0;
  const total = subtotal + deliveryFee;

  const isPhone1Valid = /^\d{10}$/.test(phone1.replace(/\D/g, ''));
  const canSubmit =
    customerName.trim().length > 0 &&
    isPhone1Valid &&
    deliveryZoneId !== '' &&
    paymentMethod !== null &&
    acceptedTerms;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    setPromoStatus(MOCK_PROMO_CODES.has(code) ? 'valid' : 'invalid');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !selectedZone || !paymentMethod) return;

    setSubmitState('submitting');
    setError(null);

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        phone1: phone1.replace(/\D/g, ''),
        phone2: phone2.trim() ? phone2.replace(/\D/g, '') : undefined,
        city: city.trim() || 'Abidjan',
        deliveryZoneId: selectedZone.id,
        deliveryZone: selectedZone,
        district: district.trim() || undefined,
        promoCode: promoStatus === 'valid' ? promoCode.trim().toUpperCase() : undefined,
        items,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
      });

      if (paymentMethod === 'wave') {
        setSubmitState('wave-redirect');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      setConfirmedOrder(order);
      setSubmitState('success');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Une erreur est survenue lors de la commande.',
      );
      setSubmitState('idle');
    }
  };

  if (submitState === 'wave-redirect') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm font-medium text-foreground">Redirection vers Wave...</p>
      </div>
    );
  }

  if (submitState === 'success' && confirmedOrder) {
    const isWave = confirmedOrder.paymentMethod === 'wave';
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-black">
          ✓
        </div>
        <p className="text-lg font-semibold text-foreground">
          {isWave ? 'Paiement simulé, commande enregistrée' : 'Commande confirmée'}
        </p>
        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          {isWave
            ? "L'intégration Wave réelle n'est pas encore active : votre commande a été enregistrée en attente de paiement."
            : 'Vous paierez à la livraison.'}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Référence : {confirmedOrder.id}
        </p>
        <Link href="/" className="mt-2 text-sm font-medium text-accent hover:underline">
          ← Retourner à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-surface p-4 dark:border-zinc-800">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size ?? ''}`} className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={item.product.imageUrl}
                alt={item.product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-0.5">
              <p className="line-clamp-1 text-sm font-semibold text-foreground">
                {item.product.title}
              </p>
              {item.size && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Taille : {item.size}</p>
              )}
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Qté : {item.quantity}</p>
            </div>
            <p className="shrink-0 self-center text-sm font-semibold text-foreground">
              {formatPrice(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Prénom & Nom">
            <input
              type="text"
              required
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Ex: Jean Kouassi"
              className={inputClass}
            />
          </Field>

          <Field
            label="Numéro de téléphone 1"
            error={
              phone1Touched && phone1.length > 0 && !isPhone1Valid
                ? 'Le numéro doit contenir 10 chiffres.'
                : undefined
            }
          >
            <input
              type="tel"
              required
              value={phone1}
              onChange={(event) => setPhone1(event.target.value)}
              onBlur={() => setPhone1Touched(true)}
              placeholder="Ex: 07 00 00 00 00"
              className={inputClass}
            />
          </Field>

          <Field label="Numéro de téléphone 2 (optionnel)">
            <input
              type="tel"
              value={phone2}
              onChange={(event) => setPhone2(event.target.value)}
              placeholder="Ex: 01 00 00 00 00"
              className={inputClass}
            />
          </Field>

          <Field label="Ville">
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Zone de livraison">
            <select
              required
              value={deliveryZoneId}
              onChange={(event) => setDeliveryZoneId(event.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Sélectionner une zone
              </option>
              {deliveryZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} - {formatPrice(zone.fee)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Quartier de livraison / Nom de gare" hint="Cas d'expédition">
            <input
              type="text"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              placeholder="Détails de livraison"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Code promo">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(event) => {
                setPromoCode(event.target.value);
                setPromoStatus('idle');
              }}
              placeholder="Votre code"
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="shrink-0 rounded-lg border border-zinc-300 px-4 text-sm font-medium text-foreground hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Appliquer
            </button>
          </div>
          {promoStatus === 'valid' && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              Code promo appliqué ✓
            </span>
          )}
          {promoStatus === 'invalid' && (
            <span className="text-xs text-red-500">Code promo invalide</span>
          )}
        </Field>

        <div className="rounded-2xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          <div className="flex justify-between py-1">
            <span className="text-zinc-500 dark:text-zinc-400">Montant articles</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-zinc-500 dark:text-zinc-400">Frais de livraison</span>
            <span className="text-foreground">
              {selectedZone ? formatPrice(deliveryFee) : '—'}
            </span>
          </div>
          <div className="mt-1 flex justify-between border-t border-zinc-200 pt-2 font-semibold dark:border-zinc-800">
            <span className="text-foreground">Montant total</span>
            <span className="text-foreground">{formatPrice(total)}</span>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Mode de paiement</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PaymentOption
              label="Payer avec Wave"
              isActive={paymentMethod === 'wave'}
              onClick={() => setPaymentMethod('wave')}
            />
            <PaymentOption
              label="Paiement à la livraison"
              isActive={paymentMethod === 'cash_on_delivery'}
              onClick={() => setPaymentMethod('cash_on_delivery')}
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-accent"
          />
          Je confirme avoir lu et accepté les conditions générales
        </label>

        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || submitState === 'submitting'}
          className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitState === 'submitting' ? 'Validation...' : 'Valider la commande'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {hint && !error && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</span>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

function PaymentOption({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
        isActive
          ? 'border-accent bg-accent/10 text-foreground'
          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300'
      }`}
    >
      <span
        className={`h-4 w-4 shrink-0 rounded-full border-2 ${
          isActive ? 'border-accent bg-accent' : 'border-zinc-400 dark:border-zinc-600'
        }`}
      />
      {label}
    </button>
  );
}
