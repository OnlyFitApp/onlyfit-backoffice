// GERADO por scripts/contract.mjs a partir de contract/. Não editar.
// Cada método chama exatamente uma fachada api.*_v1 do OnlyFit Core.

/** Executa a fachada `fn` (schema api) com os parâmetros nomeados. */
export type Transport = (fn: string, args: Record<string, unknown>) => Promise<unknown>;

/** Códigos de erro estáveis; o app traduz cada um para uma chave de i18n. */
export type ApiErrorCode =
  | 'auth.access_pending'
  | 'auth.required'
  | 'commerce.acceptance_required'
  | 'commerce.acceptances_required'
  | 'commerce.cannot_buy_self'
  | 'commerce.contract_already_active'
  | 'commerce.delivery_not_available'
  | 'commerce.idempotency_conflict'
  | 'commerce.idempotency_required'
  | 'commerce.invalid_channel'
  | 'commerce.offer_not_found'
  | 'commerce.offer_unavailable'
  | 'commerce.purchase_not_found'
  | 'identity.access_required'
  | 'identity.code_exhausted'
  | 'identity.document_in_use'
  | 'identity.invalid_address'
  | 'identity.invalid_changes'
  | 'identity.invalid_code'
  | 'identity.invalid_device'
  | 'identity.invalid_document'
  | 'identity.invalid_preferences'
  | 'identity.invalid_value'
  | 'identity.legal_required'
  | 'identity.legal_version_outdated'
  | 'identity.onboarding_incomplete'
  | 'identity.one_default_address'
  | 'identity.own_code'
  | 'identity.preferences_conflict'
  | 'identity.too_young'
  | 'identity.unknown_action'
  | 'identity.unknown_field'
  | 'identity.unknown_interest'
  | 'identity.unknown_level'
  | 'identity.username_invalid'
  | 'identity.username_taken'
  | 'nutrition.diet_not_editable'
  | 'nutrition.diet_not_found'
  | 'nutrition.free_meal_not_found'
  | 'nutrition.idempotency_required'
  | 'nutrition.invalid_diet'
  | 'nutrition.invalid_free_meal'
  | 'nutrition.invalid_meal'
  | 'nutrition.invalid_photo'
  | 'nutrition.invalid_range'
  | 'nutrition.meal_not_found'
  | 'nutrition.unknown_action'
  | 'org.already_member'
  | 'org.archive_requires_paused'
  | 'org.business_has_clients'
  | 'org.business_locked'
  | 'org.business_not_found'
  | 'org.cannot_hire_self'
  | 'org.company_document_in_use'
  | 'org.company_fields_required'
  | 'org.consent_item_not_requested'
  | 'org.consent_owner_required'
  | 'org.contract_already_ended'
  | 'org.contract_end_reason_required'
  | 'org.contract_ended'
  | 'org.contract_not_found'
  | 'org.contract_party_required'
  | 'org.document_required'
  | 'org.forbidden'
  | 'org.idempotency_required'
  | 'org.invalid_access_level'
  | 'org.invalid_action'
  | 'org.invalid_business'
  | 'org.invalid_commercial_profile'
  | 'org.invalid_company_document'
  | 'org.invalid_consent_action'
  | 'org.invalid_consent_items'
  | 'org.invalid_consultancy_settings'
  | 'org.invalid_kind'
  | 'org.invalid_location'
  | 'org.invalid_niche'
  | 'org.invalid_offer'
  | 'org.invalid_offer_state'
  | 'org.invalid_scope'
  | 'org.invalid_search'
  | 'org.invalid_sports'
  | 'org.invalid_state'
  | 'org.invalid_website'
  | 'org.invite_not_found'
  | 'org.kind_immutable'
  | 'org.legal_document_unavailable'
  | 'org.member_banned'
  | 'org.member_not_found'
  | 'org.not_consultancy'
  | 'org.offer_changed'
  | 'org.offer_in_use'
  | 'org.offer_limit_reached'
  | 'org.offer_locked'
  | 'org.offer_not_found'
  | 'org.offer_type_immutable'
  | 'org.offer_type_unavailable'
  | 'org.offer_unavailable'
  | 'org.owner_protected'
  | 'org.pause_requires_published'
  | 'org.price_below_minimum'
  | 'org.professional_not_found'
  | 'org.professional_required'
  | 'org.restore_requires_archived'
  | 'org.resubmit_requires_rejected'
  | 'org.resume_requires_paused'
  | 'org.scope_required'
  | 'org.self_invite'
  | 'org.verification_pending'
  | 'org.website_in_use'
  | 'platform.invalid_events'
  | 'platform.mark_window_closed'
  | 'platform.reason_note_required'
  | 'platform.reason_required'
  | 'staff.catalog_changed'
  | 'staff.delivery_in_use'
  | 'staff.forbidden'
  | 'staff.invalid_action'
  | 'staff.invalid_billing'
  | 'staff.invalid_catalog_key'
  | 'staff.invalid_offer_type'
  | 'staff.invalid_payment_provider'
  | 'staff.invalid_payment_secret'
  | 'staff.mfa_required'
  | 'staff.offer_type_in_use'
  | 'staff.offer_type_not_configured'
  | 'staff.offer_type_not_found'
  | 'staff.payment_secret_required'
  | 'staff.unsupported_delivery'
  | 'training.activity_not_found'
  | 'training.already_started'
  | 'training.cannot_delete_session'
  | 'training.cannot_edit_session'
  | 'training.future_workout'
  | 'training.idempotency_required'
  | 'training.invalid_activities'
  | 'training.invalid_activity'
  | 'training.invalid_actual'
  | 'training.invalid_consumption'
  | 'training.invalid_dates'
  | 'training.invalid_link'
  | 'training.invalid_mark'
  | 'training.invalid_occurrence_edit'
  | 'training.invalid_range'
  | 'training.invalid_review'
  | 'training.invalid_routine'
  | 'training.invalid_scope'
  | 'training.invalid_start_date'
  | 'training.invalid_steps'
  | 'training.invalid_workout'
  | 'training.library_full'
  | 'training.not_assigned'
  | 'training.program_already_active'
  | 'training.program_not_found'
  | 'training.routine_not_found'
  | 'training.routine_prescribed'
  | 'training.scheduled_not_found'
  | 'training.scope_requires_program'
  | 'training.session_not_found'
  | 'training.unknown_action'
  | 'training.unknown_exercise'
  | 'training.unknown_sport'
  | 'training.unknown_step'
  | 'training.unknown_template'
  | 'training.workout_not_editable'
  | 'training.workout_not_found';

export interface Access {
  /** Veredito do servidor (J01.5). */
  status: "confirm_email" | "waitlist" | "granted";
  invite_code: InviteCode;
}

export interface Account {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  /** Redes sociais: { instagram: "...", ... } */
  social_links: Record<string, unknown>;
  is_professional: boolean;
}

export interface AccountCard {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

export interface AccountPrivate {
  phone: string | null;
  birth_date: string | null;
  country_code: string | null;
  goal: string | null;
  /** catálogo fitness_levels */
  level: string | null;
}

export interface Activities {
  activities: ActivityItem[];
}

export interface ActivitiesSaved {
  saved: number;
  linked: number;
  /** Atividades com mais de um treino possível no dia: ficam avulsas até o Corrigir. */
  ambiguous: number;
  deleted: number;
}

export interface Activity {
  id: string;
  source: "app" | "watch" | "health" | "manual";
  provider: string | null;
  /** Tipo exato recebido (J20.10). */
  activity_type: string | null;
  sport_id: string | null;
  local_date: string;
  started_at: string;
  ended_at: string | null;
  metrics: Record<string, unknown>;
  scheduled_id: string | null;
  link_method: "session" | "exact" | "auto" | "manual" | null;
  link_confidence: number | null;
  title: string | null;
  workout: ActivityWorkout | null;
  route: RoutePoint[];
  observations: ActivityObservation[];
  /** Corrigir atividade: todo treino do dia, inclusive retirado da agenda. */
  link_candidates: LinkCandidate[];
  origin: ActivityOrigin;
}

export interface ActivityItem {
  id: string;
  source: "app" | "watch" | "health" | "manual";
  provider: string | null;
  activity_type: string | null;
  sport_id: string | null;
  title: string | null;
  local_date: string;
  started_at: string;
  ended_at: string | null;
  metrics: Record<string, unknown>;
  scheduled_id: string | null;
  link_method: "session" | "exact" | "auto" | "manual" | null;
  link_confidence: number | null;
  workout_title: string | null;
  has_route: boolean;
  origin: ActivityOrigin;
}

export interface ActivityObservation {
  id: string;
  provider: string | null;
  activity_type: string | null;
  started_at: string;
  ended_at: string | null;
  metrics: Record<string, unknown>;
  source_name: string | null;
}

export interface ActivityOrigin {
  bundle_identifier?: string;
  source_name?: string;
  device_id?: string;
  device_name?: string;
  device_model?: string;
  timezone?: string;
}

/** Quem gravou (J20.5): app, aparelho e fuso. */
export interface ActivityOriginInput {
  bundle_identifier?: string;
  source_name?: string;
  device_id?: string;
  device_name?: string;
  device_model?: string;
  timezone?: string;
}

export interface ActivitySaveInput {
  id?: string;
  delete?: boolean;
  /** Vincula manualmente ao treino agendado do dia. */
  scheduled_id?: string;
  activity_type?: string;
  sport_id?: string | null;
  local_date?: string;
  started_at?: string;
  /** Métricas extensíveis preservadas pelo Core; unidades fazem parte das chaves canônicas. */
  metrics?: Record<string, unknown>;
  title?: string;
  /** Com scheduled_id: lembra a escolha para o mesmo provedor, tipo bruto e treino (J20.7). */
  remember?: boolean;
  /** Desfaz o vínculo. Sem ele, salvar outros campos mantém o vínculo. */
  unlink?: boolean;
}

export interface ActivitySaved {
  activity: Activity | null;
  deleted: boolean;
}

export interface ActivityWorkout {
  id: string;
  title: string;
  sport_id: string | null;
  date: string;
}

export interface AffinityGroup {
  id: string;
  name_key: string;
}

export interface AssignedWorkout {
  id: string;
  title: string;
  sport_id: string | null;
  steps: number;
  updated_at: string;
  professional: AccountCard | null;
}

export interface Bootstrap {
  account: Account;
  private: AccountPrivate;
  preferences: Preferences;
  interests: string[];
  /** [{ id, label?, recipient_name?, line1, number?, complement?, neighborhood?, city, state?, postal_code, country_code, is_default? }] */
  addresses: Record<string, unknown>[];
  access: Access;
  onboarding: Onboarding;
  legal_pending: LegalDocument[];
  document: DocumentStatus;
}

export interface BusinessAccount {
  id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  is_professional: boolean;
}

export interface BusinessActionResult {
  id: string;
  status: "draft" | "pending_review" | "rejected" | "published" | "paused" | "archived" | "suspended" | "deleted";
}

export interface BusinessDetail {
  id: string;
  name: string;
  kind: "independent" | "company";
  status: "draft" | "pending_review" | "rejected" | "published" | "paused" | "archived" | "suspended";
  logo_url: string;
  description: string;
  website_url: string | null;
  company_document_last4: string | null;
  niche: string | null;
  sports: string[];
  city: string | null;
  state: string | null;
  service_mode: string | null;
  verified: boolean;
  verification_reason: string | null;
  commercial_profile: CommercialProfile;
  can_delete: boolean;
  owner: BusinessAccount;
  inviter: BusinessAccount | null;
  my_access_level: "admin" | "editor" | "member";
  is_owner: boolean;
  membership_status: "invited" | "active";
  created_at: string;
  updated_at: string;
  team: BusinessMember[];
}

export interface BusinessMember {
  account: BusinessAccount;
  access_level: "admin" | "editor" | "member";
  is_owner: boolean;
  status: "invited" | "active" | "left";
  invited_by: string | null;
  created_at: string;
}

export interface BusinessNiche {
  id: string;
  name_key: string;
  label: string;
}

export interface BusinessSaveInput {
  id?: string;
  idempotency_key?: string;
  kind: "independent" | "company";
  name: string;
  description: string;
  logo_url: string;
  website_url?: string;
  company_document?: string;
  niche?: string;
  sports?: string[];
  city?: string;
  state?: string;
  service_mode?: "online" | "in_person" | "hybrid";
  commercial_profile?: CommercialProfileInput;
}

export interface BusinessSaveResult {
  id: string;
  status: "draft" | "pending_review" | "rejected" | "published" | "paused" | "archived" | "suspended";
}

export interface BusinessScreen {
  businesses: BusinessSummary[];
  people: BusinessAccount[];
  business: BusinessDetail | null;
}

export interface BusinessSummary {
  id: string;
  name: string;
  kind: "independent" | "company";
  status: "draft" | "pending_review" | "rejected" | "published" | "paused" | "archived" | "suspended";
  logo_url: string;
  description: string;
  website_url: string | null;
  company_document_last4: string | null;
  niche: string | null;
  sports: string[];
  city: string | null;
  state: string | null;
  service_mode: string | null;
  verified: boolean;
  commercial_profile: CommercialProfile;
  can_delete: boolean;
  verification_reason: string | null;
  owner: BusinessAccount;
  inviter: BusinessAccount | null;
  my_access_level: "admin" | "editor" | "member";
  is_owner: boolean;
  membership_status: "invited" | "active";
  created_at: string;
  updated_at: string;
}

export interface CalendarDay {
  date: string;
  items: CalendarItem[];
  /** Minutos de atividade real no dia (J16.58); execução vinculada conta uma vez. */
  minutes: number;
  unlinked_activities: UnlinkedActivity[];
}

export interface CalendarItem {
  scheduled_id: string;
  workout_id: string;
  title: string;
  sport_id: string;
  status: "planned" | "in_progress" | "done" | "incomplete" | "not_done" | "missed";
  /** HH:MM agendado, quando houver. */
  time: string | null;
  /** Aplicação do programa de treino de onde veio a ocorrência. */
  program_id: string | null;
  /** De onde veio o treino: próprio, OnlyFit Health, profissional, compra, programa ou cópia do dia. */
  origin: "personal" | "official" | "professional" | "purchase" | "program" | "day";
}

export interface Catalogs {
  affinity_groups: AffinityGroup[];
  sports: Sport[];
  /** Motivos de 'não fiz' (J16.22); 'other' exige texto. */
  not_done_reasons: NotDoneReason[];
  /** Níveis do onboarding (J01.2). */
  fitness_levels: FitnessLevel[];
  /** Nichos válidos para cadastro de empresa. */
  business_niches: BusinessNiche[];
  /** Modelos de protocolo mantidos pela staff; desativar não quebra protocolos já aplicados. */
  protocol_templates: ProtocolTemplate[];
  /** Tipos de oferta configurados pela staff; capacidade de entrega é validada no servidor. */
  offer_types: OfferType[];
  /** Canais de pagamento habilitados pela staff. */
  payment_channels: PaymentChannel[];
}

export interface CatalogsResponse {
  version: string;
  changed: boolean;
  catalogs: Catalogs | null;
}

export interface CheckoutAcceptance {
  key: string;
  version: string;
}

export interface CheckoutPurchase {
  id: string;
  offer_id: string;
  status: "pending" | "confirmed" | "failed" | "cancelled" | "refunded";
  channel: "free" | "stripe_card";
  amount: number;
  currency: string;
  offer_name: string;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: "week" | "month" | "2month" | "quarter" | "semester" | "year" | null;
  provider_reference: string | null;
  contract_id: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export interface CommercialProfile {
  professionals: string;
  story: string;
  achievements: string[];
}

export interface CommercialProfileInput {
  professionals: string;
  story: string;
  achievements: string[];
}

export interface ConsultancyAccessDecision {
  item: "training" | "diet" | "protocols" | "health";
  decision: "allowed" | "denied" | "revoked";
  decided_at: string;
}

export interface ConsultancyBusiness {
  id: string;
  name: string;
  logo_url: string;
}

export interface ConsultancyConsentResult {
  contract_id: string;
  status: "active" | "past_due" | "ended";
  access: ConsultancyAccessDecision[];
}

export interface ConsultancyContractEndResult {
  contract_id: string;
  status: "ended";
  ended_at: string;
  ended_by: string;
  reason: string;
}

export interface ConsultancyDocument {
  key: string;
  version: string;
  kind: "service_contract" | "operational_data" | "health_data" | "physical_activity_risk";
  title: string;
  url: string;
  acceptance_text: string;
}

export interface ConsultancyHirePreparation {
  offer: ConsultancyOffer;
  member: ConsultancyParty;
  professional: ConsultancyParty;
  business: ConsultancyBusiness;
  scope: ("training" | "diet" | "protocols" | "health")[];
  documents: ConsultancyDocument[];
  existing_contract: ExistingConsultancyContract | null;
}

export interface ConsultancyOffer {
  id: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: string | null;
  settings: Record<string, unknown>;
}

export interface ConsultancyOfferAction {
  id: string;
  status: "draft" | "published" | "paused" | "archived" | "deleted";
  version: number;
}

export interface ConsultancyOfferBusiness {
  id: string;
  name: string;
  logo_url: string;
  verified: boolean;
}

export interface ConsultancyOfferDetail {
  offer: ConsultancyOfferManaged;
  business: ConsultancyOfferBusiness;
  professional: ConsultancyProfessional;
}

export interface ConsultancyOfferList {
  can_edit: boolean;
  items: ConsultancyOfferManaged[];
}

export interface ConsultancyOfferManaged {
  id: string;
  business_id: string;
  professional_id: string;
  type: string;
  name: string;
  description: string;
  image_url: string | null;
  status: "draft" | "ready" | "published" | "paused" | "archived";
  price: number;
  currency: string;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: "week" | "month" | "2month" | "quarter" | "semester" | "year" | null;
  settings: ConsultancySettings;
  data_access_scope: ("training" | "diet" | "protocols" | "health")[];
  version: number;
  first_sold_at: string | null;
  created_at: string;
  updated_at: string;
  can_edit: boolean;
}

export interface ConsultancyOfferSaveInput {
  id: string | null;
  business_id: string;
  type: string;
  name: string;
  description: string;
  image_url: string | null;
  price: number;
  settings: ConsultancySettingsInput;
  data_access_scope: ("training" | "diet" | "protocols" | "health")[];
  expected_version: number | null;
  idempotency_key: string | null;
}

export interface ConsultancyOfferType {
  key: string;
  label: string;
  description: string;
  icon: string | null;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: "week" | "month" | "2month" | "quarter" | "semester" | "year" | null;
  minimum_price: number;
  max_per_business: number | null;
}

export interface ConsultancyOfferTypeList {
  items: ConsultancyOfferType[];
}

export interface ConsultancyParty {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface ConsultancyProfessional {
  id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  is_professional: boolean;
}

export interface ConsultancySettings {
  format: "online" | "in_person" | "hybrid";
  duration_minutes: number;
  sessions_per_cycle: number;
  deliverables: string[];
  scheduling_notes: string;
  intake_form_required: boolean;
  welcome_message: string;
  requires_physical_activity_risk_acknowledgement: boolean;
}

export interface ConsultancySettingsInput {
  format: "online" | "in_person" | "hybrid";
  duration_minutes: number;
  sessions_per_cycle: number;
  deliverables: string[];
  scheduling_notes: string;
  intake_form_required: boolean;
  welcome_message: string;
  requires_physical_activity_risk_acknowledgement: boolean;
}

export interface DeletedActivityInput {
  provider: "apple_health" | "health_connect";
  external_id: string;
}

export interface Devices {
  devices: number;
}

export interface Diet {
  id: string;
  title: string;
  objective: string;
  origin: "personal" | "official" | "professional" | "purchase";
  source_diet_id: string | null;
  active: boolean;
  prescriber: AccountCard | null;
  /** Só a dieta própria (não copiada) é editável; as demais ajustam só horários (J16.52). */
  editable: boolean;
  targets: DietTargets;
  meals: DietMeal[];
  updated_at: string;
}

/** mealTime envia meal_id e time; as demais ações não enviam campos. */
export interface DietActionInput {
  meal_id?: string;
  /** HH:MM */
  time?: string;
}

export interface DietItem {
  id: string;
  food_id?: string;
  name: string;
  quantity_g: number;
  quantity_value?: number;
  unit: string;
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  notes?: string;
  order: number;
}

export interface DietItemInput {
  id?: string;
  food_id?: string;
  name: string;
  quantity_g: number;
  quantity_value?: number;
  unit: string;
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  notes?: string;
}

export interface DietLibrary {
  active_id: string | null;
  personal: DietSummary[];
  purchased: DietSummary[];
  prescribed: DietSummary[];
  onlyfit_health: DietSummary[];
}

export interface DietMeal {
  id: string;
  title: string;
  /** HH:MM */
  time?: string;
  critical: boolean;
  order: number;
  items: DietItem[];
}

export interface DietMealInput {
  id?: string;
  title: string;
  /** HH:MM */
  time?: string;
  critical?: boolean;
  items: DietItemInput[];
}

/** { id? | idempotency_key (ao criar), title, objective?, meals } */
export interface DietSaveInput {
  id?: string;
  idempotency_key?: string;
  title: string;
  objective?: string;
  meals: DietMealInput[];
}

export interface DietSummary {
  id: string;
  title: string;
  objective: string;
  origin: "personal" | "official" | "professional" | "purchase";
  source_diet_id: string | null;
  active: boolean;
  /** Catálogo OnlyFit Health: a pessoa já tem a cópia dela (J16.88). */
  applied: boolean;
  prescriber: AccountCard | null;
  targets: DietTargets;
  meal_count: number;
  meals: DietMeal[];
  updated_at: string;
}

export interface DietTargets {
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

export interface DocumentStatus {
  present: boolean;
  last4: string | null;
}

export interface EventsSaved {
  accepted: number;
  duplicates: number;
  rejected: number;
}

export interface ExerciseHit {
  id: string;
  name: string;
  kind: "exercise" | "technique";
  sport_id: string | null;
  muscles: string[];
  equipment: string | null;
  video_url: string | null;
  thumb_url: string | null;
  own: boolean;
}

export interface ExerciseRef {
  id: string;
  name: string;
  kind: "exercise" | "technique";
  video_url: string | null;
  thumb_url: string | null;
}

export interface ExistingConsultancyContract {
  id: string;
  status: "active" | "past_due";
  started_at: string;
}

export interface FitnessLevel {
  id: string;
  name_key: string;
}

export interface Food {
  id: string;
  name: string;
  brand: string | null;
  origin: "taco" | "tbca" | "usda" | "brand" | "restaurant" | "personal";
  barcode: string | null;
  /** Nutrientes por 100 g: kcal, protein_g, carbs_g, fat_g, fiber_g… */
  per_100g: Record<string, unknown>;
  portions: FoodPortion[];
  own: boolean;
}

export interface FoodPortion {
  unit: string;
  label?: string;
  grams: number;
}

export interface FreeMeal {
  id: string;
  title: string;
  composition: string | null;
  time: string | null;
  photo: MealPhoto | null;
}

/** { id?, date, title, composition?, time?, photo?, delete? } */
export interface FreeMealInput {
  id?: string;
  date?: string;
  title?: string;
  composition?: string;
  /** HH:MM */
  time?: string;
  delete?: boolean;
  /** arquivo já enviado pelo app */
  photo?: MealPhotoInput;
}

/** Campos discriminados por action: mark ou consume; consume exige idempotency_key; edit envia title, instruction? e time?; unmark, undo e remove não enviam campos. */
export interface HabitActionInput {
  status?: "done" | "not_done";
  reason?: string;
  note?: string;
  value?: number;
  idempotency_key?: string;
  title?: string;
  instruction?: string;
  /** HH:MM */
  time?: string;
}

export interface HabitDay {
  date: string;
  routine_id: string;
  routine_title: string;
  done: number;
  not_done: number;
  total: number;
}

export interface Habits {
  date: string;
  routines: Routine[];
  history: HabitDay[];
}

export interface ImportedActivityInput {
  onlyfit_id?: string;
  provider: "apple_health" | "health_connect" | "onlyfit_watch";
  external_id: string;
  activity_type: string;
  sport_id?: string;
  local_date: string;
  started_at: string;
  ended_at?: string;
  /** Métricas extensíveis preservadas pelo Core; unidades fazem parte das chaves canônicas. */
  metrics: Record<string, unknown>;
  scheduled_id?: string;
  title?: string;
  /** Quem gravou (J20.5): app, aparelho e fuso. */
  origin?: ActivityOriginInput;
  route?: RoutePointInput[];
  /** Watch: passos feitos por step_id, como no player. */
  steps_done?: Record<string, unknown>;
}

export interface InviteCode {
  code: string | null;
  uses: number | null;
  /** null até a staff definir */
  max_uses: number | null;
}

export interface LegalDocument {
  key: string;
  version: string;
  kind: "acceptance" | "notice" | "declaration";
  title: string;
  url: string;
  required: boolean;
}

export interface Library {
  quota: LibraryQuota;
  personal: WorkoutSummary[];
  assigned: AssignedWorkout[];
  onlyfit_health: OfficialWorkout[];
  programs: ProgramApplication[];
}

export interface LibraryQuota {
  used: number;
  /** null = sem limite */
  limit: number | null;
}

export interface LinkCandidate {
  scheduled_id: string;
  workout_id: string;
  title: string;
  sport_id: string | null;
  removed: boolean;
  taken: boolean;
}

export interface LinkedActivity {
  id: string;
  activity_type: string | null;
  provider: string | null;
  metrics: Record<string, unknown>;
  link_method: "session" | "exact" | "auto" | "manual";
}

/** mark: status, reason?, note?, photo?; edit: title, time?. */
export interface MealActionInput {
  status?: "done" | "not_done";
  reason?: string;
  note?: string;
  title?: string;
  /** HH:MM */
  time?: string;
  /** arquivo já enviado pelo app */
  photo?: MealPhotoInput;
}

export interface MealPhoto {
  bucket: string;
  path: string;
  mime: string;
}

/** arquivo já enviado pelo app */
export interface MealPhotoInput {
  bucket: string;
  path: string;
  mime: string;
  bytes: number;
}

export interface NotDoneReason {
  id: string;
  name_key: string;
}

export interface NutritionCalendarDay {
  date: string;
  planned: number;
  done: number;
  not_done: number;
  free_meals: number;
}

export interface NutritionDay {
  date: string;
  /** Registrar vale hoje e ontem (J16.1/36). */
  editable: boolean;
  diet: Diet | null;
  meals: NutritionDayMeal[];
  free_meals: FreeMeal[];
}

export interface NutritionDayMeal {
  meal_id: string;
  title: string;
  time: string | null;
  edited: boolean;
  status: "done" | "not_done" | null;
  reason: string | null;
  note: string | null;
  photo: MealPhoto | null;
}

/** Campos discriminados por action: remove, mark, edit ou swapExercise. */
export interface OccurrenceActionInput {
  scope?: "day" | "forward" | "all";
  status?: "done" | "not_done";
  reason?: string;
  note?: string;
  steps?: WorkoutStepInput[];
  time?: string;
  date?: string;
  title?: string;
  notes?: string;
  step_id?: string;
  exercise_id?: string;
}

export interface OfferType {
  id: string;
  name_key: string;
  label: string;
  description: string;
  icon: string | null;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: string | null;
  max_per_business: number | null;
  unique_per_owner_profile: boolean;
  requires_affinity_group: boolean;
  requires_product_category: boolean;
  delivery: "club" | "consultancy" | "workout" | "diet" | "physical_product" | "course" | "challenge" | "community" | "platform_membership";
}

export interface OfficialWorkout {
  id: string;
  title: string;
  sport_id: string | null;
  steps: number;
  updated_at: string;
  scheduled: boolean;
}

export interface Onboarding {
  done: boolean;
  missing: ("goal" | "birth_date" | "interests" | "level")[];
}

export interface Outcome {
  /** J16.27: done a partir de 85% da meta; missed sem execução depois do dia. */
  state: "planned" | "in_progress" | "done" | "incomplete" | "not_done" | "missed";
  /** Parte da meta cumprida (0–1+); null sem meta mensurável (J16.28). */
  adherence: number | null;
  source: string | null;
  /** Motivo de 'não fiz' (catálogo not_done_reasons). */
  reason: string | null;
}

export interface PaymentChannel {
  id: string;
  name_key: string;
  provider: string;
}

export interface PaymentProviderCredentials {
  stripe_publishable_key?: string;
  stripe_secret_key?: string;
  stripe_webhook_secret?: string;
  asaas_api_key?: string;
  asaas_webhook_token?: string;
}

export interface PaymentProviderEnvironment {
  environment: "sandbox" | "production";
  stripe_publishable_key_configured: boolean;
  stripe_publishable_key_last4: string | null;
  stripe_secret_key_configured: boolean;
  stripe_secret_key_last4: string | null;
  stripe_webhook_secret_configured: boolean;
  stripe_webhook_secret_last4: string | null;
  asaas_api_key_configured: boolean;
  asaas_api_key_last4: string | null;
  asaas_webhook_token_configured: boolean;
  updated_at: string | null;
}

export interface PaymentProviderSettings {
  can_edit: boolean;
  environments: PaymentProviderEnvironment[];
}

export interface Preferences {
  /** Documento de preferências (locale, theme, timezone, push_marketing...) */
  settings: Record<string, unknown>;
  version: number;
}

export interface Program {
  id: string;
  title: string;
  sport_id: string;
  weeks: number;
  applied: boolean;
  start_date: string | null;
  progress: ProgramProgress | null;
  active_application: string | null;
  days: ProgramDay[];
}

export interface ProgramApplication {
  id: string;
  title: string;
  sport_id: string;
  weeks: number;
  start_date: string;
  source_program_id: string | null;
  progress: ProgramProgress;
}

export interface ProgramDay {
  week: number;
  weekday: number;
  workout_id: string;
  title: string;
  notes: string;
  scheduled_id: string | null;
  date: string | null;
  state: string | null;
}

export interface ProgramProgress {
  done: number;
  total: number;
}

export interface ProgramSummary {
  id: string;
  title: string;
  sport_id: string;
  weeks: number;
  weekly_sessions: number;
  origin: "catalog" | "purchase" | "professional";
  active_application: string | null;
}

export interface ProtocolTemplate {
  id: string;
  name_key: string;
  flow: "generic" | "water" | "supplement";
  icon_key: string;
  category_key: string;
  description_key: string;
  structure_locked: boolean;
  clinical_notice: boolean;
  featured: boolean;
  default_steps: ProtocolTemplateStep[];
}

export interface ProtocolTemplateStep {
  title_key: string;
  instruction_key?: string | null;
  time: string | null;
  duration_minutes?: number | null;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp?: string;
}

export interface RoutePointInput {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp?: string;
}

export interface Routine {
  id: string;
  title: string;
  notes: string;
  prescribed: boolean;
  prescriber: RoutinePrescriber | null;
  catalog_key: string | null;
  goal_ml: number | null;
  notifications: boolean;
  timing_mode: "specific" | "interval";
  reminder_start: string | null;
  reminder_end: string | null;
  reminder_interval_minutes: number | null;
  reminder_text: string | null;
  container_ml: number | null;
  category: string | null;
  icon_key: string | null;
  frequency: string;
  recurrence: RoutineRecurrence;
  start_date: string;
  end_date: string | null;
  cycle_cutoff: string;
  timezone: string;
  template_locked: boolean;
  status: "active" | "ended";
  source: "self" | "prescribed" | "onlyfit_health";
  steps: RoutineStep[];
  today: RoutineStepToday[];
  events: RoutineConsumptionEvent[];
}

export interface RoutineConsumptionEvent {
  id: string;
  step_id: string;
  time: string;
  value: number;
  consumed_at: string;
}

export interface RoutinePrescriber {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

export interface RoutineRecurrence {
  unit?: string;
  interval?: number;
  weekdays?: number[];
  month_day?: number;
}

export interface RoutineRecurrenceInput {
  unit?: "day" | "week" | "month" | "year";
  interval?: number;
  weekdays?: number[];
  month_day?: number;
}

/** Salva/exclui protocolo próprio ou adota uma cópia encerrada com adopt_from (J16.3). */
export interface RoutineSaveInput {
  id?: string;
  delete?: boolean;
  adopt_from?: string;
  title?: string;
  notes?: string;
  catalog_key?: string;
  goal_ml?: number | null;
  notifications?: boolean;
  timing_mode?: "specific" | "interval";
  reminder_start?: string | null;
  reminder_end?: string | null;
  reminder_interval_minutes?: number | null;
  reminder_text?: string | null;
  container_ml?: number | null;
  category?: string | null;
  icon_key?: string | null;
  frequency?: "daily" | "weekly" | "fortnightly" | "every_15_days" | "monthly" | "bimonthly" | "quarterly" | "semiannual" | "annual" | "custom";
  recurrence?: RoutineRecurrenceInput;
  start_date?: string;
  end_date?: string | null;
  cycle_cutoff?: string;
  timezone?: string;
  template_locked?: boolean;
  steps?: RoutineStepInput[];
}

export interface RoutineStep {
  id: string;
  title: string;
  instruction?: string | null;
  time?: string | null;
  days?: number[];
  target?: RoutineTarget | null;
  duration_minutes?: number | null;
  order?: number | null;
  required?: boolean | null;
  notification_offset_minutes?: number | null;
  allow_snooze?: boolean | null;
}

export interface RoutineStepInput {
  id?: string;
  title: string;
  instruction?: string | null;
  time?: string;
  days?: number[];
  duration_minutes?: number | null;
  order?: number;
  required?: boolean;
  notification_offset_minutes?: number;
  allow_snooze?: boolean;
  target?: RoutineTargetInput;
}

export interface RoutineStepToday {
  step_id: string;
  time: string | null;
  title: string;
  mark: StepMark | null;
  instruction: string | null;
  /** Editada só neste dia. */
  edited: boolean;
}

export interface RoutineTarget {
  value: number;
  unit: string;
}

export interface RoutineTargetInput {
  value: number;
  unit: string;
}

export interface ScheduledWorkout {
  scheduled_id: string;
  time: string | null;
  program_id: string | null;
  workout: Workout;
  session: SessionSummary | null;
  outcome: Outcome;
  activity: LinkedActivity | null;
}

export interface Session {
  id: string;
  scheduled_id: string | null;
  status: "in_progress" | "completed";
  started_at: string;
  completed_at: string | null;
  workout: Workout;
  /** Realizado por passo: { <step_id>: { reps, kg, ... } } */
  steps_done: Record<string, unknown>;
  /** Avaliação depois do treino (sensação, notas). */
  review: Record<string, unknown> | null;
  /** { <exercise_id>: realizado da última vez } — só com a execução em andamento. */
  suggestions: Record<string, unknown>;
}

/** Conclusão completa/parcial, duração, sensação, notas e parciais; a avaliação pode vir depois de encerrar. */
export interface SessionReviewInput {
  completion?: "full" | "partial";
  duration_seconds?: number;
  feeling?: string;
  notes?: string;
  /** Parciais privados da modalidade, preservados sem projeção em logs sociais. */
  partials?: Record<string, unknown>;
}

export interface SessionStepInput {
  step_id: string;
  /** Resultado estruturado da modalidade para este passo. */
  actual: Record<string, unknown>;
}

export interface SessionSummary {
  id: string;
  status: "in_progress" | "completed";
  started_at: string;
  completed_at: string | null;
}

export interface Sport {
  id: string;
  name_key: string;
  engine: "strength" | "endurance" | "crossfit" | "hyrox" | "combat" | "mobility" | "custom";
  affinity_group_id: string | null;
}

export interface StaffOfferType {
  key: string;
  label: string;
  description: string;
  icon: string | null;
  active: boolean;
  position: number;
  version: number;
  delivery: "club" | "consultancy" | "workout" | "diet" | "physical_product" | "course" | "challenge" | "community" | "platform_membership";
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: "week" | "month" | "2month" | "quarter" | "semester" | "year" | null;
  minimum_price: number | null;
  platform_fee_percent: number | null;
  platform_fee_fixed: number | null;
  max_per_business: number | null;
  unique_per_owner_profile: boolean;
  requires_affinity_group: boolean;
  requires_product_category: boolean;
  active_offers_count: number;
  configured: boolean;
}

export interface StaffOfferTypeSaveInput {
  key: string;
  label: string;
  description: string;
  icon: string | null;
  position: number;
  delivery: "club" | "consultancy" | "workout" | "diet" | "physical_product" | "course" | "challenge" | "community" | "platform_membership";
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: "week" | "month" | "2month" | "quarter" | "semester" | "year" | null;
  minimum_price: number;
  platform_fee_percent: number;
  platform_fee_fixed: number;
  max_per_business: number | null;
  unique_per_owner_profile: boolean;
  requires_affinity_group: boolean;
  requires_product_category: boolean;
  expected_version?: number | null;
}

export interface StaffOfferTypes {
  can_edit: boolean;
  items: StaffOfferType[];
}

export interface StepMark {
  status: string | null;
  reason: string | null;
  note: string | null;
  value: number | null;
}

export interface TeamAccount {
  id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  is_professional: boolean;
}

export interface TeamActionInput {
  username?: string;
  account_id?: string;
  access_level?: "admin" | "editor" | "member";
}

export interface TeamActionResult {
  business_id: string;
  team: TeamMember[];
}

export interface TeamMember {
  account: TeamAccount;
  access_level: "admin" | "editor" | "member";
  is_owner: boolean;
  status: "invited" | "active" | "left";
  invited_by: string | null;
  created_at: string;
}

export interface TrainingDay {
  date: string;
  workouts: ScheduledWorkout[];
}

export interface UnlinkedActivity {
  id: string;
  activity_type: string | null;
}

export interface Workout {
  id: string;
  title: string;
  sport_id: string;
  notes: string;
  steps: WorkoutStep[];
}

/** Datas futuras usadas pela ação schedule; as demais ações não enviam campos. */
export interface WorkoutActionInput {
  dates?: string[];
}

export interface WorkoutDetail {
  id: string;
  title: string;
  sport_id: string;
  notes: string;
  steps: WorkoutStep[];
  origin: "personal" | "official" | "professional" | "purchase" | "program" | "day";
  professional: AccountCard | null;
  editable: boolean;
}

export interface WorkoutSaveInput {
  id?: string;
  sport_id: string;
  title: string;
  notes?: string;
  steps: WorkoutStepInput[];
  dates?: string[];
}

export interface WorkoutStep {
  id: string;
  position: number;
  title: string;
  exercise: ExerciseRef | null;
  /** Prescrição do passo; formato por motor (séries/reps, pace, WOD...) */
  prescription: Record<string, unknown>;
}

export interface WorkoutStepInput {
  id?: string;
  exercise_id?: string;
  title?: string;
  /** Prescrição estruturada específica da modalidade; o Core preserva o objeto integralmente. */
  prescription: Record<string, unknown>;
}

export interface WorkoutSummary {
  id: string;
  title: string;
  sport_id: string | null;
  steps: number;
  updated_at: string;
}

export function createApi(call: Transport) {
  return {
    app: {
      /** Todos os catálogos do app numa leitura. Mande a versão que o app já tem: se nada mudou, vem changed = false e sem catálogos. (query; contract/app/catalogs.v1.json) */
      catalogs: (input: { version?: string } = {}) => call('app_catalogs_v1', { p_version: input.version }) as Promise<CatalogsResponse>,
      /** Grava a telemetria em lote (até 200 eventos). Reenviar não duplica; evento com mais de 7 dias é recusado. (command; contract/app/events_save.v1.json) */
      eventsSave: (input: { events: Record<string, unknown>[] }) => call('app_events_save_v1', { p_events: input.events }) as Promise<EventsSaved>,
    },
    commerce: {
      /** Consulta o estado confirmado pelo servidor de um checkout do titular. (query; contract/commerce/checkout.v1.json) */
      checkout: (input: { purchaseId: string }) => call('commerce_checkout_v1', { p_purchase_id: input.purchaseId }) as Promise<CheckoutPurchase>,
      /** Inicia um checkout com preço, partes, escopo e documentos resolvidos pelo servidor; R$ 0 confirma atomicamente. (command; contract/commerce/checkout_start.v1.json) */
      checkoutStart: (input: { offerId: string; channel: "free" | "stripe_card"; idempotencyKey: string; acceptances: CheckoutAcceptance[] }) => call('commerce_checkout_start_v1', { p_offer_id: input.offerId, p_channel: input.channel, p_idempotency_key: input.idempotencyKey, p_acceptances: input.acceptances }) as Promise<CheckoutPurchase>,
    },
    identity: {
      /** applyCode: usa o código de indicação de outra pessoa para sair da fila. Devolve o veredito de acesso. (command; contract/identity/access_act.v1.json) */
      accessAct: (input: { action: "applyCode"; code?: string }) => call('identity_access_act_v1', { p_action: input.action, p_code: input.code }) as Promise<Access>,
      /** Tudo o que o app precisa ao abrir: conta, dados privados, preferências, interesses, endereços, veredito de acesso, onboarding, termos pendentes e situação do documento. (query; contract/identity/bootstrap.v1.json) */
      bootstrap: () => call('identity_bootstrap_v1', {}) as Promise<Bootstrap>,
      /** register grava o aparelho só quando o token muda (e tira o token de outra conta); remove tira o token no logout. (command; contract/identity/device_act.v1.json) */
      deviceAct: (input: { action: "register" | "remove"; token: string; platform?: "ios" | "android" | "web"; deviceId?: string }) => call('identity_device_act_v1', { p_action: input.action, p_token: input.token, p_platform: input.platform, p_device_id: input.deviceId }) as Promise<Devices>,
      /** Guarda o CPF cifrado (exigido só quando há pagamento). O app só volta a ver os 4 últimos dígitos. (command; contract/identity/document_save.v1.json) */
      documentSave: (input: { document: string }) => call('identity_document_save_v1', { p_document: input.document }) as Promise<Bootstrap>,
      /** Documentos legais vigentes, para o cadastro (antes do login). (query; contract/identity/legal_documents.v1.json) */
      legalDocuments: () => call('identity_legal_documents_v1', {}) as Promise<LegalDocument[]>,
      /** Conclui o onboarding: objetivo, nascimento (16+), nível, interesses (1 ou mais) e os termos obrigatórios vigentes, tudo junto. Devolve o bootstrap. (command; contract/identity/onboarding_save.v1.json) */
      onboardingSave: (input: { onboarding: Record<string, unknown> }) => call('identity_onboarding_save_v1', { p_onboarding: input.onboarding }) as Promise<Bootstrap>,
      /** Salva o perfil por blocos (public, private, preferences, interests, addresses, legal). Tudo ou nada; devolve o bootstrap atualizado. (command; contract/identity/profile_save.v1.json) */
      profileSave: (input: { profile: Record<string, unknown> }) => call('identity_profile_save_v1', { p_profile: input.profile }) as Promise<Bootstrap>,
    },
    nutrition: {
      /** Calendário de Nutrição (J16.57/58): por dia, refeições previstas, feitas, não feitas e refeições livres. (query; contract/nutrition/calendar.v1.json) */
      calendar: (input: { from: string; to: string }) => call('nutrition_calendar_v1', { p_from: input.from, p_to: input.to }) as Promise<NutritionCalendarDay[]>,
      /** O dia de Nutrição: dieta ativa, marcação e edição de cada refeição no dia e refeições livres. (query; contract/nutrition/day.v1.json) */
      day: (input: { date?: string } = {}) => call('nutrition_day_v1', { p_date: input.date }) as Promise<NutritionDay>,
      /** Detalhe da dieta: refeições, itens, metas e quem prescreveu. (query; contract/nutrition/diet.v1.json) */
      diet: (input: { dietId: string }) => call('nutrition_diet_v1', { p_diet_id: input.dietId }) as Promise<Diet>,
      /** apply (ativa; da OnlyFit Health cria a cópia uma vez, J16.50/88) · remove (tira da biblioteca) · mealTime (horário, J16.52). Devolve a biblioteca. (command; contract/nutrition/diet_act.v1.json) */
      dietAct: (input: { dietId: string; action: "apply" | "remove" | "mealTime"; input?: DietActionInput }) => call('nutrition_diet_act_v1', { p_diet_id: input.dietId, p_action: input.action, p_input: input.input }) as Promise<DietLibrary>,
      /** Salva a dieta própria inteira (cria com idempotency_key ou substitui). Metas somadas dos itens. (command; contract/nutrition/diet_save.v1.json) */
      dietSave: (input: { diet: DietSaveInput }) => call('nutrition_diet_save_v1', { p_diet: input.diet }) as Promise<Diet>,
      /** Busca de alimentos: começo do nome e bases comuns (TACO, TBCA) primeiro; pessoais só para quem criou; código de barras exato. (query; contract/nutrition/food_search.v1.json) */
      foodSearch: (input: { query?: string; barcode?: string; limit?: number; offset?: number } = {}) => call('nutrition_food_search_v1', { p_query: input.query, p_barcode: input.barcode, p_limit: input.limit, p_offset: input.offset }) as Promise<Food[]>,
      /** Refeição livre (J16.37–40): já consumida, só o título é obrigatório, sem horário inventado; criar, editar e excluir só hoje e ontem. Devolve o dia. (command; contract/nutrition/free_meal_save.v1.json) */
      freeMealSave: (input: { meal: FreeMealInput }) => call('nutrition_free_meal_save_v1', { p_meal: input.meal }) as Promise<NutritionDay>,
      /** Biblioteca de dietas: própria, comprada, prescrita e OnlyFit Health (ler não cria cópia), com a ativa. (query; contract/nutrition/library.v1.json) */
      library: () => call('nutrition_library_v1', {}) as Promise<DietLibrary>,
      /** mark (feito | não feito com motivo, J16.22) · unmark — hoje e ontem; edit/remove só neste dia (J16.67), qualquer data. Devolve o dia. (command; contract/nutrition/meal_act.v1.json) */
      mealAct: (input: { mealId: string; action: "mark" | "unmark" | "edit" | "remove"; date?: string; input?: MealActionInput }) => call('nutrition_meal_act_v1', { p_meal_id: input.mealId, p_action: input.action, p_date: input.date, p_input: input.input }) as Promise<NutritionDay>,
    },
    org: {
      /** Lista os negócios, compõe perfil e equipe e pesquisa profissionais elegíveis para convite. (query; contract/org/business.v1.json) */
      business: (input: { businessId?: string; search?: string } = {}) => call('org_business_v1', { p_business_id: input.businessId, p_search: input.search }) as Promise<BusinessScreen>,
      /** Publica, pausa, retoma, arquiva, restaura, exclui ou reenvia um negócio. (command; contract/org/business_act.v1.json) */
      businessAct: (input: { businessId: string; action: "publish" | "pause" | "resume" | "archive" | "restore" | "delete" | "resubmit" }) => call('org_business_act_v1', { p_business_id: input.businessId, p_action: input.action }) as Promise<BusinessActionResult>,
      /** Cria ou substitui atomicamente o perfil inteiro do negócio. (command; contract/org/business_save.v1.json) */
      businessSave: (input: { business: BusinessSaveInput }) => call('org_business_save_v1', { p_business: input.business }) as Promise<BusinessSaveResult>,
      /** Permite ao titular autorizar, negar ou revogar itens de acesso do contrato de consultoria. (command; contract/org/consent_decide.v1.json) */
      consentDecide: (input: { contractId: string; action: "allow" | "deny" | "revoke"; items: ("training" | "diet" | "protocols" | "health")[] }) => call('org_consent_decide_v1', { p_contract_id: input.contractId, p_action: input.action, p_items: input.items }) as Promise<ConsultancyConsentResult>,
      /** Lê uma consultoria publicada para contratação ou uma oferta própria para gestão. (query; contract/org/consultancy_offer.v1.json) */
      consultancyOffer: (input: { offerId: string }) => call('org_consultancy_offer_v1', { p_offer_id: input.offerId }) as Promise<ConsultancyOfferDetail>,
      /** Muda o ciclo de vida de uma oferta de consultoria com versão otimista. (command; contract/org/consultancy_offer_act.v1.json) */
      consultancyOfferAct: (input: { offerId: string; action: "publish" | "pause" | "resume" | "archive" | "restore" | "delete"; expectedVersion: number }) => call('org_consultancy_offer_act_v1', { p_offer_id: input.offerId, p_action: input.action, p_expected_version: input.expectedVersion }) as Promise<ConsultancyOfferAction>,
      /** Cria ou atualiza uma oferta de consultoria com configuração integralmente tipada. (command; contract/org/consultancy_offer_save.v1.json) */
      consultancyOfferSave: (input: { offer: ConsultancyOfferSaveInput }) => call('org_consultancy_offer_save_v1', { p_offer: input.offer }) as Promise<ConsultancyOfferManaged>,
      /** Lista tipos ativos cuja entrega real é consultoria. (query; contract/org/consultancy_offer_types.v1.json) */
      consultancyOfferTypes: () => call('org_consultancy_offer_types_v1', {}) as Promise<ConsultancyOfferTypeList>,
      /** Lista as ofertas de consultoria de um negócio para a equipe autorizada. (query; contract/org/consultancy_offers.v1.json) */
      consultancyOffers: (input: { businessId: string }) => call('org_consultancy_offers_v1', { p_business_id: input.businessId }) as Promise<ConsultancyOfferList>,
      /** Encerra imediatamente um contrato de consultoria por uma das partes e remove seus acessos. (command; contract/org/contract_end.v1.json) */
      contractEnd: (input: { contractId: string; reason: string }) => call('org_contract_end_v1', { p_contract_id: input.contractId, p_reason: input.reason }) as Promise<ConsultancyContractEndResult>,
      /** Prepara a contratação de uma consultoria com partes, escopo e documentos vigentes validados no servidor. (query; contract/org/hire_prepare.v1.json) */
      hirePrepare: (input: { offerId: string }) => call('org_hire_prepare_v1', { p_offer_id: input.offerId }) as Promise<ConsultancyHirePreparation>,
      /** Convida, aceita, recusa, muda o nível de acesso ou remove uma pessoa da equipe. (command; contract/org/team_act.v1.json) */
      teamAct: (input: { businessId: string; action: "invite" | "accept" | "decline" | "setAccess" | "remove"; input?: TeamActionInput }) => call('org_team_act_v1', { p_business_id: input.businessId, p_action: input.action, p_input: input.input }) as Promise<TeamActionResult>,
    },
    staff: {
      /** Ativa ou desativa um tipo de oferta sem apagar seu histórico nem quebrar referências. (command; contract/staff/offer_type_act.v1.json) */
      offerTypeAct: (input: { key: string; action: "activate" | "deactivate"; expectedVersion: number }) => call('staff_offer_type_act_v1', { p_key: input.key, p_action: input.action, p_expected_version: input.expectedVersion }) as Promise<StaffOfferType>,
      /** Cria ou substitui atomicamente toda a configuração de um tipo de oferta; a chave é imutável. (command; contract/staff/offer_type_save.v1.json) */
      offerTypeSave: (input: { item: StaffOfferTypeSaveInput }) => call('staff_offer_type_save_v1', { p_item: input.item }) as Promise<StaffOfferType>,
      /** Lista todos os tipos de oferta, inclusive inativos, com configuração comercial, versão e impacto de desativação. (query; contract/staff/offer_types.v1.json) */
      offerTypes: () => call('staff_offer_types_v1', {}) as Promise<StaffOfferTypes>,
      /** Atualiza somente os segredos enviados para um ambiente de pagamentos. (command; contract/staff/payment_provider_save.v1.json) */
      paymentProviderSave: (input: { environment: "sandbox" | "production"; credentials: PaymentProviderCredentials }) => call('staff_payment_provider_save_v1', { p_environment: input.environment, p_credentials: input.credentials }) as Promise<PaymentProviderEnvironment>,
      /** Lista o estado das credenciais de pagamento sem revelar segredos. (query; contract/staff/payment_providers.v1.json) */
      paymentProviders: () => call('staff_payment_providers_v1', {}) as Promise<PaymentProviderSettings>,
    },
    training: {
      /** Histórico unificado: importadas, manuais e execuções no app ou no Watch, um item por esforço, do mais recente ao mais antigo. (query; contract/training/activities.v1.json) */
      activities: (input: { before?: string; limit?: number } = {}) => call('training_activities_v1', { p_before: input.before, p_limit: input.limit }) as Promise<Activities>,
      /** Importa um lote do Watch, Apple Saúde ou Health Connect. A execução iniciada no OnlyFit volta com o mesmo id e é enriquecida; repetir não duplica; a mesma execução regravada pela mesma origem vira observação; o vínculo é decidido por dia (J20.7). Lote vazio só reavalia os dias pendentes. (command; contract/training/activities_save.v1.json) */
      activitiesSave: (input: { activities: ImportedActivityInput[]; deleted?: DeletedActivityInput[] }) => call('training_activities_save_v1', { p_activities: input.activities, p_deleted: input.deleted }) as Promise<ActivitiesSaved>,
      /** Detalhe da atividade: provedor, tipo exato, métricas, rota, observações de cada origem, vínculo com confiança e os treinos do dia para corrigir. (query; contract/training/activity.v1.json) */
      activity: (input: { activityId: string }) => call('training_activity_v1', { p_activity_id: input.activityId }) as Promise<Activity>,
      /** Atividade manual, edição de importada (título, modalidade, métricas; o tipo exato recebido não muda e o antes vai para a auditoria), correção de vínculo (vira manual; se o treino escolhido já foi executado no app ou no Watch, a importada vira observação dessa execução, que é devolvida) ou exclusão. (command; contract/training/activity_save.v1.json) */
      activitySave: (input: { activity: ActivitySaveInput }) => call('training_activity_save_v1', { p_activity: input.activity }) as Promise<ActivitySaved>,
      /** Dias de um intervalo (até 62): treinos com estado, minutos de atividade e atividades importadas sem vínculo. (query; contract/training/calendar.v1.json) */
      calendar: (input: { from: string; to: string }) => call('training_calendar_v1', { p_from: input.from, p_to: input.to }) as Promise<CalendarDay[]>,
      /** Treinos do dia com passos, mídia, execução no player, desfecho (feito, incompleto, não feito, perdido) e atividade vinculada. (query; contract/training/day.v1.json) */
      day: (input: { date?: string } = {}) => call('training_day_v1', { p_date: input.date }) as Promise<TrainingDay>,
      /** Busca exercícios ignorando acento e caixa (J16.77): oficiais e os próprios. (query; contract/training/exercise_search.v1.json) */
      exerciseSearch: (input: { query?: string; sport?: string; muscle?: string; limit?: number; offset?: number } = {}) => call('training_exercise_search_v1', { p_query: input.query, p_sport: input.sport, p_muscle: input.muscle, p_limit: input.limit, p_offset: input.offset }) as Promise<ExerciseHit[]>,
      /** Marca ou desmarca uma etapa do protocolo (feito, não feito com motivo), registra consumo ou desfaz (só hoje e ontem); edita ou exclui a etapa só daquele dia (qualquer data). (command; contract/training/habit_act.v1.json) */
      habitAct: (input: { routineId: string; stepId: string; action: "mark" | "unmark" | "consume" | "undo" | "edit" | "remove"; date?: string; input?: HabitActionInput }) => call('training_habit_act_v1', { p_routine_id: input.routineId, p_step_id: input.stepId, p_action: input.action, p_date: input.date, p_input: input.input }) as Promise<Habits>,
      /** Salva ou exclui um protocolo próprio (sem rascunho nem pausa; excluir é definitivo). Prescrito não é mexido pelo membro. (command; contract/training/habit_save.v1.json) */
      habitSave: (input: { routine: RoutineSaveInput }) => call('training_habit_save_v1', { p_routine: input.routine }) as Promise<Habits>,
      /** Meus protocolos: etapas de hoje com a marcação e o histórico dos últimos dias. (query; contract/training/habits.v1.json) */
      habits: (input: { date?: string; historyDays?: number } = {}) => call('training_habits_v1', { p_date: input.date, p_history_days: input.historyDays }) as Promise<Habits>,
      /** Biblioteca: treinos próprios (com a cota), atribuídos (com o profissional), OnlyFit Health (sem criar cópia ao ler) e programas aplicados. (query; contract/training/library.v1.json) */
      library: (input: { sport?: string } = {}) => call('training_library_v1', { p_sport: input.sport }) as Promise<Library>,
      /** Age sobre um treino agendado e devolve o dia atualizado: retirar (3 alcances), marcar feito/não feito, editar conteúdo/horário/data só da ocorrência, trocar exercício só no dia. (command; contract/training/occurrence_act.v1.json) */
      occurrenceAct: (input: { scheduledId: string; action: "remove" | "mark" | "edit" | "swapExercise"; input?: OccurrenceActionInput }) => call('training_occurrence_act_v1', { p_scheduled_id: input.scheduledId, p_action: input.action, p_input: input.input }) as Promise<TrainingDay>,
      /** Um programa (modelo ou aplicação da pessoa) com os dias, datas, estado e progresso. (query; contract/training/program.v1.json) */
      program: (input: { programId: string }) => call('training_program_v1', { p_program_id: input.programId }) as Promise<Program>,
      /** apply (uma aplicação ativa por programa, J16.47) · reschedule (só o pendente muda, J16.48) · remove (sai a agenda futura, execuções ficam, J16.49). Devolve o programa. (command; contract/training/program_act.v1.json) */
      programAct: (input: { programId: string; action: "apply" | "reschedule" | "remove"; idempotencyKey: string; startDate?: string }) => call('training_program_act_v1', { p_program_id: input.programId, p_action: input.action, p_idempotency_key: input.idempotencyKey, p_start_date: input.startDate }) as Promise<Program>,
      /** Programas de treino disponíveis para o membro, sem criar aplicação ao consultar. (query; contract/training/programs.v1.json) */
      programs: (input: { sport?: string } = {}) => call('training_programs_v1', { p_sport: input.sport }) as Promise<ProgramSummary[]>,
      /** Grava os passos realizados em lote e, com finish, encerra. Tudo ou nada; repetir dá o mesmo resultado. (command; contract/training/session_save.v1.json) */
      sessionSave: (input: { sessionId: string; steps?: SessionStepInput[]; finish?: boolean; review?: SessionReviewInput }) => call('training_session_save_v1', { p_session_id: input.sessionId, p_steps: input.steps, p_finish: input.finish, p_review: input.review }) as Promise<Session>,
      /** Inicia (ou retoma) a sessão de um treino agendado. Congela o prescrito. (command; contract/training/session_start.v1.json) */
      sessionStart: (input: { scheduledId: string; idempotencyKey: string }) => call('training_session_start_v1', { p_scheduled_id: input.scheduledId, p_idempotency_key: input.idempotencyKey }) as Promise<Session>,
      /** Um treino: próprio, atribuído ou fonte OnlyFit Health, com a origem e se é editável. (query; contract/training/workout.v1.json) */
      workout: (input: { workoutId: string }) => call('training_workout_v1', { p_workout_id: input.workoutId }) as Promise<WorkoutDetail>,
      /** schedule {dates} (fonte OnlyFit Health vira uma cópia só, J16.72) · archive (treino próprio) · removeFromLibrary (atribuído; o original não muda). Devolve a biblioteca. (command; contract/training/workout_act.v1.json) */
      workoutAct: (input: { workoutId: string; action: "schedule" | "archive" | "removeFromLibrary"; input?: WorkoutActionInput }) => call('training_workout_act_v1', { p_workout_id: input.workoutId, p_action: input.action, p_input: input.input }) as Promise<Library>,
      /** Salva um treino próprio; com datas, entra na agenda na hora (J16.69). Treino prescrito não é editado (J16.63). (command; contract/training/workout_save.v1.json) */
      workoutSave: (input: { workout: WorkoutSaveInput }) => call('training_workout_save_v1', { p_workout: input.workout }) as Promise<WorkoutDetail>,
    },
  };
}

export type OnlyFitApi = ReturnType<typeof createApi>;
