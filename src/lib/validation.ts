import * as Yup from "yup";

export const preferencesSchema = Yup.object({
  bookingId: Yup.string().required("Невірне посилання"),

  // Час заїзду
  arrivalTime: Yup.string().required("Оберіть орієнтовний час заїзду"),

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
  activeExcursions: Yup.boolean(),
  activeMushrooms: Yup.boolean(),

  // Транспорт
  transport: Yup.string().oneOf(["none", "own_car", "transfer"], "Оберіть варіант").required(),
  carPlate: Yup.string().when("transport", {
    is: "own_car",
    then: (s) =>
      s
        .required("Вкажіть номерний знак")
        .matches(/^[A-ZА-ЯІЇЄҐ]{2}\d{4}[A-ZА-ЯІЇЄҐ]{2}$/, "Невірний формат (напр. АА1234ВВ)"),
    otherwise: (s) => s.optional(),
  }),

  // Дитяче ліжко
  needBabyBed: Yup.boolean(),

  // Гігієна
  hygieneSlippers: Yup.boolean(),
  hygieneToothbrush: Yup.boolean(),
  hygieneShampoo: Yup.boolean(),
  hygieneSoap: Yup.boolean(),

  // Коментарі
  comments: Yup.string().max(1000, "Максимум 1000 символів").optional(),

  // Згода з умовами
  agreeToTerms: Yup.boolean()
    .oneOf([true], "Необхідно погодитися з умовами")
    .required("Необхідно погодитися з умовами"),
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
  activeExcursions: false,
  activeMushrooms: false,
  transport: "none",
  carPlate: "",
  needBabyBed: false,
  hygieneSlippers: true,
  hygieneToothbrush: true,
  hygieneShampoo: true,
  hygieneSoap: true,
  comments: "",
  agreeToTerms: false,
};
