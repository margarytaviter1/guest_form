"use client";

import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { preferencesSchema, initialValues, type PreferencesValues } from "@/lib/validation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

function MealGuestsField() {
  const { values } = useFormikContext<PreferencesValues>();
  if (values.mealPlan === "none") return null;
  return (
    <div className="form-group">
      <label htmlFor="mealGuests">На скільки осіб?</label>
      <Field name="mealGuests" id="mealGuests" type="number" min="1" max="20" />
      <ErrorMessage name="mealGuests" component="div" className="error" />
    </div>
  );
}

export default function GuestForm() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "";
  const [submitted, setSubmitted] = useState(false);

  if (!bookingId) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🔗</span>
        <h2>Невірне посилання</h2>
        <p>Будь ласка, скористайтеся посиланням, яке ви отримали від нас.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="success-message">
        <span className="success-icon">🎉</span>
        <h2>Дякуємо!</h2>
        <p>Ваші побажання збережено. Чекаємо на вас!</p>
      </div>
    );
  }

  return (
    <Formik
      initialValues={{ ...initialValues, bookingId }}
      validationSchema={preferencesSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const res = await fetch("/api/guests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await res.json();
          if (data.success) {
            setSubmitted(true);
          } else {
            alert("Помилка: " + (data.errors?.join(", ") || data.error));
          }
        } catch {
          alert("Помилка мережі. Спробуйте ще раз.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form noValidate>
          {/* ── Час заїзду ── */}
          <div className="form-section">
            <div className="form-section-title">🕐 Час заїзду</div>
            <div className="form-group">
              <label htmlFor="arrivalTime">Орієнтовний час прибуття</label>
              <Field as="select" name="arrivalTime" id="arrivalTime">
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00 (стандарт)</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00 або пізніше</option>
              </Field>
              <ErrorMessage name="arrivalTime" component="div" className="error" />
            </div>
          </div>

          {/* ── Харчування ── */}
          <div className="form-section">
            <div className="form-section-title">🍽 Харчування</div>
            <div className="form-group">
              <label htmlFor="mealPlan">Чи потрібне харчування?</label>
              <Field as="select" name="mealPlan" id="mealPlan">
                <option value="none">Ні, дякую</option>
                <option value="breakfast">Сніданок</option>
                <option value="twice">Сніданок + вечеря</option>
                <option value="three">Тричі на день (повний пансіон)</option>
              </Field>
              <ErrorMessage name="mealPlan" component="div" className="error" />
            </div>
            <MealGuestsField />
          </div>

          {/* ── Розваги ── */}
          <div className="form-section">
            <div className="form-section-title">🚴 Дозвілля</div>
            <p className="section-hint">Оберіть, що вас цікавить — ми підготуємо заздалегідь</p>
            <div className="toggle-grid">
              <label className="toggle-card">
                <Field type="checkbox" name="activeBicycle" />
                <span className="toggle-emoji">🚲</span>
                <span className="toggle-label">Велосипед</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="activeSup" />
                <span className="toggle-emoji">🏄</span>
                <span className="toggle-label">SUP-борд</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="activeGarden" />
                <span className="toggle-emoji">🌿</span>
                <span className="toggle-label">Город</span>
              </label>
            </div>
          </div>

          {/* ── Дитяче ліжко ── */}
          <div className="form-section">
            <div className="form-section-title">👶 Для дітей</div>
            <label className="toggle-row">
              <Field type="checkbox" name="needBabyCot" />
              <span>Потрібне дитяче ліжечко</span>
            </label>
          </div>

          {/* ── Гігієна ── */}
          <div className="form-section">
            <div className="form-section-title">🧴 Одноразові гігієнічні засоби</div>
            <p className="section-hint">Все обрано за замовчуванням — приберіть зайве</p>
            <div className="toggle-grid">
              <label className="toggle-card">
                <Field type="checkbox" name="hygieneSlippers" />
                <span className="toggle-emoji">🩴</span>
                <span className="toggle-label">Тапочки</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="hygieneToothbrush" />
                <span className="toggle-emoji">🪥</span>
                <span className="toggle-label">Щітка</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="hygieneShampoo" />
                <span className="toggle-emoji">🧴</span>
                <span className="toggle-label">Шампунь</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="hygieneSoap" />
                <span className="toggle-emoji">🧼</span>
                <span className="toggle-label">Мило</span>
              </label>
            </div>
          </div>

          {/* ── Коментарі ── */}
          <div className="form-section">
            <div className="form-section-title">💬 Побажання</div>
            <div className="form-group">
              <Field
                as="textarea"
                name="comments"
                id="comments"
                rows={3}
                placeholder="Алергії, особливі потреби, час тиші…"
              />
              <ErrorMessage name="comments" component="div" className="error" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Зберігаємо…" : "Зберегти побажання"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
