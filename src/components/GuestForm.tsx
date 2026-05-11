"use client";

import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { preferencesSchema, initialValues, type PreferencesValues } from "@/lib/validation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import logger, { sanitize } from "@/lib/browser-logger";

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

function CarPlateField() {
  const { values } = useFormikContext<PreferencesValues>();
  if (values.transport === "own_car") {
    return (
      <div className="form-group">
        <label htmlFor="carPlate">Номерний знак автомобіля</label>
        <Field
          name="carPlate"
          id="carPlate"
          placeholder="АА1234ВВ"
          style={{ textTransform: "uppercase" }}
        />
        <ErrorMessage name="carPlate" component="div" className="error" />
      </div>
    );
  }
  if (values.transport === "transfer") {
    return (
      <p className="section-hint" style={{ marginTop: "0.5rem", marginBottom: 0 }}>
        ℹ️ Ми перевіримо доступні варіанти трансферу та повідомимо вас
      </p>
    );
  }
  return null;
}

export default function GuestForm() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "";
  const [submitted, setSubmitted] = useState(false);

  if (!bookingId) {
    return (
      <div className="empty-state" role="alert">
        <span className="empty-icon" aria-hidden="true">
          🔗
        </span>
        <h2>Невірне посилання</h2>
        <p>Будь ласка, скористайтеся посиланням, яке ви отримали від нас.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="success-message" role="status" aria-live="polite">
        <span className="success-icon" aria-hidden="true">
          🎉
        </span>
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
        logger.info({ formData: sanitize(values) }, "Guest form submission started");
        try {
          const res = await fetch("/api/guests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await res.json();
          if (data.success) {
            logger.info({ id: data.id }, "Guest form submitted successfully");
            setSubmitted(true);
          } else {
            logger.warn(
              { errors: data.errors, error: data.error },
              "Guest form submission rejected",
            );
            alert("Помилка: " + (data.errors?.join(", ") || data.error));
          }
        } catch (err) {
          logger.error({ err }, "Network error during guest form submission");
          alert("Помилка мережі. Спробуйте ще раз.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form noValidate aria-label="Форма побажань гостя">
          {/* ── Час заїзду ── */}
          <fieldset className="form-section">
            <legend className="form-section-title">
              <span aria-hidden="true">🕐</span> Час заїзду
            </legend>
            <div className="form-group">
              <label htmlFor="arrivalTime">Орієнтовний час прибуття</label>
              <Field
                as="select"
                name="arrivalTime"
                id="arrivalTime"
                aria-describedby="arrivalTime-error"
              >
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
              <ErrorMessage name="arrivalTime">
                {(msg) => (
                  <div className="error" id="arrivalTime-error" role="alert">
                    {msg}
                  </div>
                )}
              </ErrorMessage>
            </div>
          </fieldset>

          {/* ── Харчування ── */}
          <fieldset className="form-section">
            <legend className="form-section-title">
              <span aria-hidden="true">🍽</span> Харчування
            </legend>
            <div className="form-group">
              <label htmlFor="mealPlan">Чи потрібне харчування?</label>
              <Field as="select" name="mealPlan" id="mealPlan" aria-describedby="mealPlan-error">
                <option value="none">Ні, дякую</option>
                <option value="breakfast">Сніданок</option>
                <option value="twice">Сніданок + вечеря</option>
                <option value="three">Тричі на день (повний пансіон)</option>
              </Field>
              <ErrorMessage name="mealPlan">
                {(msg) => (
                  <div className="error" id="mealPlan-error" role="alert">
                    {msg}
                  </div>
                )}
              </ErrorMessage>
            </div>
            <MealGuestsField />
          </fieldset>

          {/* ── Розваги ── */}
          <fieldset className="form-section">
            <legend className="form-section-title">
              <span aria-hidden="true">🚴</span> Дозвілля
            </legend>
            <p className="section-hint" id="activities-hint">
              Оберіть, що вас цікавить — ми підготуємо заздалегідь
            </p>
            <div className="toggle-grid" role="group" aria-describedby="activities-hint">
              <label className="toggle-card">
                <Field type="checkbox" name="activeBicycle" aria-label="Велосипед" />
                <span className="toggle-emoji" aria-hidden="true">
                  🚲
                </span>
                <span className="toggle-label">Велосипед</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="activeSup" aria-label="SUP-борд" />
                <span className="toggle-emoji" aria-hidden="true">
                  🏄
                </span>
                <span className="toggle-label">SUP-борд</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="activeGarden" aria-label="Город" />
                <span className="toggle-emoji" aria-hidden="true">
                  🌿
                </span>
                <span className="toggle-label">Город</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="activeExcursions" aria-label="Прогулянки місцевістю" />
                <span className="toggle-emoji" aria-hidden="true">
                  🚶
                </span>
                <span className="toggle-label">Прогулянки місцевістю</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="activeMushrooms" aria-label="Збирання грибів" />
                <span className="toggle-emoji" aria-hidden="true">
                  🍄
                </span>
                <span className="toggle-label">Збирання грибів</span>
              </label>
            </div>
          </fieldset>

          {/* ── Транспорт ── */}
          <fieldset className="form-section">
            <legend className="form-section-title">
              <span aria-hidden="true">🚗</span> Транспорт
            </legend>
            <div className="form-group">
              <label htmlFor="transport">Як ви плануєте дістатися?</label>
              <Field as="select" name="transport" id="transport" aria-describedby="transport-error">
                <option value="none">Не цікавить</option>
                <option value="own_car">Власний автомобіль</option>
                <option value="transfer">Потрібен трансфер</option>
              </Field>
              <ErrorMessage name="transport">
                {(msg) => (
                  <div className="error" id="transport-error" role="alert">
                    {msg}
                  </div>
                )}
              </ErrorMessage>
            </div>
            <CarPlateField />
          </fieldset>

          {/* ── Дитяче ліжко ── */}
          <fieldset className="form-section">
            <legend className="form-section-title">
              <span aria-hidden="true">👶</span> Для дітей
            </legend>
            <label className="toggle-row">
              <Field
                type="checkbox"
                name="needBabyBed"
                aria-label="Потрібне дитяче ліжечко і крісло"
              />
              <span>Потрібне дитяче ліжечко і крісло</span>
            </label>
          </fieldset>

          {/* ── Гігієна ── */}
          <fieldset className="form-section">
            <legend className="form-section-title">
              <span aria-hidden="true">🧴</span> Одноразові гігієнічні засоби
            </legend>
            <p className="section-hint" id="hygiene-hint">
              Все обрано за замовчуванням — приберіть зайве
            </p>
            <div className="toggle-grid" role="group" aria-describedby="hygiene-hint">
              <label className="toggle-card">
                <Field type="checkbox" name="hygieneSlippers" aria-label="Тапочки" />
                <span className="toggle-emoji" aria-hidden="true">
                  🩴
                </span>
                <span className="toggle-label">Тапочки</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="hygieneToothbrush" aria-label="Щітка" />
                <span className="toggle-emoji" aria-hidden="true">
                  🪥
                </span>
                <span className="toggle-label">Щітка</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="hygieneShampoo" aria-label="Шампунь" />
                <span className="toggle-emoji" aria-hidden="true">
                  🧴
                </span>
                <span className="toggle-label">Шампунь</span>
              </label>
              <label className="toggle-card">
                <Field type="checkbox" name="hygieneSoap" aria-label="Мило" />
                <span className="toggle-emoji" aria-hidden="true">
                  🧼
                </span>
                <span className="toggle-label">Мило</span>
              </label>
            </div>
          </fieldset>

          {/* ── Коментарі ── */}
          <fieldset className="form-section">
            <legend className="form-section-title">
              <span aria-hidden="true">💬</span> Побажання
            </legend>
            <div className="form-group">
              <Field
                as="textarea"
                name="comments"
                id="comments"
                rows={3}
                placeholder="Алергії, особливі потреби, час тиші…"
                aria-label="Побажання та коментарі"
                aria-describedby="comments-error"
              />
              <ErrorMessage name="comments">
                {(msg) => (
                  <div className="error" id="comments-error" role="alert">
                    {msg}
                  </div>
                )}
              </ErrorMessage>
            </div>
          </fieldset>

          {/* ── Згода з умовами ── */}
          <div className="form-section">
            <label className="toggle-row">
              <Field type="checkbox" name="agreeToTerms" aria-describedby="agreeToTerms-error" />
              <span>
                Я погоджуюся з{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  умовами перебування
                </a>
              </span>
            </label>
            <ErrorMessage name="agreeToTerms">
              {(msg) => (
                <div className="error" id="agreeToTerms-error" role="alert">
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? "Зберігаємо…" : "Зберегти побажання"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
