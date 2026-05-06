import * as Yup from "yup";

export const preferencesSchema = Yup.object({
  bookingId: Yup.string().required("Невірне посилання"),

  // Час заїзду
  arrivalTime: Yup.string()
    .required("Оберіть орієнтовний час заїзду"),

  // Харчування
  mealPlan: Yup.string()
    .oneOf(["none", "breakfast", "twice", "three"], "Оберіть варіант")
    .required(),
  mealGuests: Yup.number()
    .min(1, "Мінімум 1")
    .max(20, "Максимум 20")
    .when("mealPlan", {
      is: (val: string) => val !== "none",
      then: (s) => s.required("Вкажіть кількість"),
      otherwise: (s) => s.optional(),
    }),

  // Розваги
  activeBicycle: Yup.boolean(),
  activeSup: Yup.boolean(),
  activeGarden: Yup.boolean(),

  // Дитяче ліжко
  needBabyCot: Yup.boolean(),

  // Гігієна
  hygieneSlippers: Yup.boolean(),
  hygieneToothbrush: Yup.boolean(),
  hygieneShampoo: Yup.boolean(),
  hygieneSoap: Yup.boolean(),

  // Коментарі
  comments: Yup.string().max(1000, "Максимум 1000 символів").optional(),
});

export type PreferencesValues = Yup.InferType<typeof preferencesSchema>;

export const initialValues: PreferencesValues = {
  bookingId: "",
  arrivalTime: "14:00",
  mealPlan: "breakfast",
  mealGuests: 2,
  activeBicycle: false,
  activeSup: false,
  activeGarden: false,
  needBabyCot: false,
  hygieneSlippers: true,
  hygieneToothbrush: true,
  hygieneShampoo: true,
  hygieneSoap: true,
  comments: "",
};
