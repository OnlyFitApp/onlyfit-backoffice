// GERADO por scripts/contract.mjs a partir de contract/. Não editar.
// Cada método chama uma fachada api.*_v1 ou uma rota Edge tipada do OnlyFit Core.

/** Executa a fachada `fn` (schema api) com os parâmetros nomeados. */
export type Transport = (fn: string, args: Record<string, unknown>) => Promise<unknown>;

/** Executa uma rota de um dos roteadores Edge canônicos. */
export type EdgeTransport = (fn: 'worker' | 'auth', path: string, body: Record<string, unknown>) => Promise<unknown>;

/** Códigos de erro estáveis; o app traduz cada um para uma chave de i18n. */
export type ApiErrorCode =
  | 'AUDIO_TRACK_PRESENT'
  | 'COVER_STORAGE_UNAVAILABLE'
  | 'INVALID_COVER_DIMENSIONS'
  | 'INVALID_COVER_JPEG'
  | 'INVALID_VIDEO_CONTRACT'
  | 'INVALID_VIDEO_SIZE'
  | 'OGG_SILENT_ATTESTATION_UNSUPPORTED'
  | 'QUARANTINE_OBJECT_CONTRACT_MISMATCH'
  | 'VIDEO_STORAGE_UNAVAILABLE'
  | 'auth.access_pending'
  | 'auth.invalid_token'
  | 'auth.required'
  | 'commerce.acceptances_required'
  | 'commerce.access_required'
  | 'commerce.content_not_found'
  | 'commerce.forbidden'
  | 'commerce.idempotency_conflict'
  | 'commerce.insufficient_balance'
  | 'commerce.invalid_ad_booking'
  | 'commerce.invalid_card_action'
  | 'commerce.invalid_channel'
  | 'commerce.invalid_network_action'
  | 'commerce.invalid_network_tab'
  | 'commerce.invalid_offer'
  | 'commerce.invalid_offer_action'
  | 'commerce.invalid_order_action'
  | 'commerce.invalid_payout'
  | 'commerce.invalid_progress'
  | 'commerce.invalid_purchase_action'
  | 'commerce.offer_changed'
  | 'commerce.offer_locked'
  | 'commerce.offer_not_found'
  | 'commerce.offer_type_unavailable'
  | 'commerce.offer_unavailable'
  | 'commerce.order_changed'
  | 'commerce.provider_not_configured'
  | 'commerce.purchase_changed'
  | 'commerce.purchase_not_found'
  | 'cover_preparation_unavailable'
  | 'health.answers_incomplete'
  | 'health.assistant_limit'
  | 'health.assistant_unavailable'
  | 'health.extraction_unavailable'
  | 'health.file_not_found'
  | 'health.file_unavailable'
  | 'health.forbidden'
  | 'health.form_not_found'
  | 'health.invalid_action'
  | 'health.invalid_answers'
  | 'health.invalid_assistant_message'
  | 'health.invalid_correction'
  | 'health.invalid_delivery_rule'
  | 'health.invalid_event'
  | 'health.invalid_extraction'
  | 'health.invalid_file'
  | 'health.invalid_media'
  | 'health.invalid_period'
  | 'health.invalid_questionnaire'
  | 'health.invalid_recipient'
  | 'health.invalid_report'
  | 'health.questionnaire_not_found'
  | 'health.upload_failed'
  | 'health.upload_incomplete'
  | 'help.invalid_request'
  | 'identity.access_required'
  | 'identity.auth_not_configured'
  | 'identity.code_exhausted'
  | 'identity.delete_failed'
  | 'identity.document_in_use'
  | 'identity.invalid_address'
  | 'identity.invalid_changes'
  | 'identity.invalid_code'
  | 'identity.invalid_credentials'
  | 'identity.invalid_device'
  | 'identity.invalid_document'
  | 'identity.invalid_preferences'
  | 'identity.invalid_value'
  | 'identity.legal_required'
  | 'identity.legal_version_outdated'
  | 'identity.missing_credentials'
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
  | 'interaction.comments_disabled'
  | 'interaction.forbidden'
  | 'interaction.invalid_action'
  | 'interaction.invalid_comment'
  | 'interaction.target_not_found'
  | 'internal.error'
  | 'invalid_cover_contract'
  | 'invalid_cover_size'
  | 'media.cover_busy'
  | 'media.cover_expired'
  | 'media.cover_not_found'
  | 'media.cover_selection_conflict'
  | 'media.file_too_large'
  | 'media.filename_required'
  | 'media.invalid_bucket'
  | 'media.invalid_completion'
  | 'media.invalid_finalization'
  | 'media.invalid_upload'
  | 'media.mime_not_allowed'
  | 'media.object_mismatch'
  | 'media.rate_limited'
  | 'media.storage_unavailable'
  | 'media.upload_busy'
  | 'media.upload_expired'
  | 'media.upload_not_found'
  | 'media.video_requires_quarantine'
  | 'nutrition.diet_not_editable'
  | 'nutrition.diet_not_found'
  | 'nutrition.food_not_found'
  | 'nutrition.free_meal_not_found'
  | 'nutrition.idempotency_required'
  | 'nutrition.invalid_diet'
  | 'nutrition.invalid_food'
  | 'nutrition.invalid_free_meal'
  | 'nutrition.invalid_meal'
  | 'nutrition.invalid_photo'
  | 'nutrition.invalid_range'
  | 'nutrition.meal_item_not_found'
  | 'nutrition.meal_not_found'
  | 'nutrition.unknown_action'
  | 'org.access_already_available'
  | 'org.access_request_invalid'
  | 'org.already_member'
  | 'org.archive_requires_paused'
  | 'org.business_has_clients'
  | 'org.business_locked'
  | 'org.business_not_found'
  | 'org.cannot_hire_self'
  | 'org.client_forbidden'
  | 'org.client_not_found'
  | 'org.client_scope_required'
  | 'org.company_document_in_use'
  | 'org.company_fields_required'
  | 'org.consent_item_not_requested'
  | 'org.consent_owner_required'
  | 'org.consultancy_required'
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
  | 'org.invalid_client_view'
  | 'org.invalid_commercial_profile'
  | 'org.invalid_company_document'
  | 'org.invalid_consent_action'
  | 'org.invalid_consent_items'
  | 'org.invalid_kind'
  | 'org.invalid_location'
  | 'org.invalid_niche'
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
  | 'org.offer_not_found'
  | 'org.offer_unavailable'
  | 'org.owner_protected'
  | 'org.pause_requires_published'
  | 'org.professional_not_found'
  | 'org.professional_required'
  | 'org.restore_requires_archived'
  | 'org.resubmit_requires_rejected'
  | 'org.resume_requires_paused'
  | 'org.self_invite'
  | 'org.verification_pending'
  | 'org.website_in_use'
  | 'platform.invalid_events'
  | 'platform.mark_window_closed'
  | 'platform.reason_note_required'
  | 'platform.reason_required'
  | 'request.invalid_json'
  | 'social.access_immutable'
  | 'social.access_required'
  | 'social.adult_required'
  | 'social.blocked'
  | 'social.forbidden'
  | 'social.group_not_found'
  | 'social.idempotency_required'
  | 'social.invalid_action'
  | 'social.invalid_challenge'
  | 'social.invalid_community'
  | 'social.invalid_composition'
  | 'social.invalid_container'
  | 'social.invalid_cover'
  | 'social.invalid_cursor'
  | 'social.invalid_group'
  | 'social.invalid_hosted_challenge'
  | 'social.invalid_media'
  | 'social.invalid_message'
  | 'social.invalid_offer'
  | 'social.invalid_post'
  | 'social.invalid_relation'
  | 'social.invalid_sport'
  | 'social.invalid_state'
  | 'social.invalid_story'
  | 'social.invalid_tab'
  | 'social.invalid_tag'
  | 'social.media_not_owned'
  | 'social.media_not_ready'
  | 'social.message_not_found'
  | 'social.message_rate_limit'
  | 'social.paid_offer_required'
  | 'social.post_not_found'
  | 'social.prize_terms_required'
  | 'social.profile_not_found'
  | 'social.story_expired'
  | 'social.story_too_long'
  | 'staff.account_not_found'
  | 'staff.catalog_changed'
  | 'staff.catalog_confirmation_required'
  | 'staff.catalog_in_use'
  | 'staff.catalog_item_not_found'
  | 'staff.catalog_name_taken'
  | 'staff.feed_settings_requires_typed_operation'
  | 'staff.forbidden'
  | 'staff.invalid_action'
  | 'staff.invalid_catalog'
  | 'staff.invalid_catalog_action'
  | 'staff.invalid_catalog_item'
  | 'staff.invalid_catalog_key'
  | 'staff.invalid_dashboard'
  | 'staff.invalid_feed_settings'
  | 'staff.invalid_filter'
  | 'staff.invalid_mail'
  | 'staff.invalid_queue_action'
  | 'staff.invalid_role'
  | 'staff.invalid_settings'
  | 'staff.last_catalog_item'
  | 'staff.mail_not_found'
  | 'staff.mfa_required'
  | 'staff.queue_item_not_found'
  | 'staff.settings_changed'
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
  | 'training.invalid_program'
  | 'training.invalid_program_state'
  | 'training.invalid_range'
  | 'training.invalid_review'
  | 'training.invalid_routine'
  | 'training.invalid_scope'
  | 'training.invalid_sport'
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

export interface CommerceAcceptance {
  key: string;
  version: string;
}

export interface CommerceAdBooking {
  id: string;
  business_id: string;
  status: "requested";
  placement: string;
  starts_on: string;
  ends_on: string;
}

export interface CommerceAdBookingInput {
  business_id: string;
  placement: string;
  starts_on: string;
  ends_on: string;
  idempotency_key: string;
}

export interface CommerceCardAction {
  status: "queued";
}

export interface CommerceCheckoutResult {
  purchase: Record<string, unknown>;
  checkout_url: string | null;
}

export interface CommerceContent {
  purchase_id: string;
  course_id: string;
  content: Record<string, unknown>;
  progress: Record<string, unknown>;
  version: number;
}

export interface CommerceMarket {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface CommerceMembers {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface CommerceNetwork {
  items: Record<string, unknown>[];
}

export interface CommerceNetworkActionData {
  network_classification?: string;
}

export interface CommerceNetworkMembership {
  id: string;
  container_id: string;
  account_id: string;
  status: string;
  classification: string | null;
}

export interface CommerceOffer {
  id: string;
  business_id: string;
  professional_id: string;
  type: string;
  delivery: string;
  name: string;
  description?: string;
  image_url?: string | null;
  status: string;
  price: number;
  currency: string;
  billing_type: string;
  billing_interval?: string | null;
  settings: Record<string, unknown>;
  target: Record<string, unknown>;
  data_access_scope?: string[];
  version: number;
  first_sold_at?: string | null;
  created_at?: string;
  updated_at?: string;
  can_edit: boolean;
}

export interface CommerceOfferSaveInput {
  id: string | null;
  business_id: string;
  type: string;
  name: string;
  description: string;
  image_url: string | null;
  price: number;
  currency: string;
  billing_type: "free" | "one_time" | "recurring";
  billing_interval: string | null;
  settings: Record<string, unknown>;
  target: Record<string, unknown>;
  data_access_scope: string[];
  expected_version: number | null;
  idempotency_key: string | null;
}

export interface CommerceOffers {
  can_edit: boolean;
  items: Record<string, unknown>[];
}

export interface CommerceOrderAction {
  tracking_code?: string;
}

export interface CommerceOrders {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface CommercePayments {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface CommercePayout {
  id: string;
  status: string;
  amount: number;
  currency: string;
  destination: Record<string, unknown>;
  version: number;
}

export interface CommercePayoutDestination {
  kind: "pix" | "bank";
  value: string;
}

export interface CommerceProgress {
  purchase_id: string;
  progress: Record<string, unknown>;
  version: number;
}

export interface CommerceProgressInput {
  lesson?: string;
  percent?: number;
  completed?: string[];
}

export interface CommercePurchase {
  id: string;
  offer_id: string;
  status: string;
  channel: string;
  amount: number;
  currency: string;
  offer_name?: string;
  billing_type?: string;
  billing_interval?: string | null;
  provider_reference?: string | null;
  contract_id?: string | null;
  confirmed_at?: string | null;
  created_at?: string;
  fulfillment: Record<string, unknown>;
  progress: Record<string, unknown>;
  version: number;
  charges: Record<string, unknown>[];
}

export interface CommercePurchases {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface CommerceWallet {
  business_id: string;
  balances: Record<string, unknown>[];
  payouts: Record<string, unknown>[];
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

export interface ConsultancyParty {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface CoverPrepared {
  upload_id: string;
  file_id: string;
  public_url: string;
  ready: boolean;
}

export interface CoverUpload {
  uploadId: string;
  uploadUrl: string;
  uploadHeaders: Record<string, unknown>;
  contentType: string;
  contentLength: number;
  expiresIn: number;
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

export interface FoodSaveInput {
  id: string | null;
  name: string;
  brand: string | null;
  barcode: string | null;
  per_100g: Record<string, unknown>;
  portions: FoodSavePortion[];
  delete?: boolean;
}

export interface FoodSavePortion {
  unit: string;
  label?: string | null;
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

export interface HealthAssistant {
  conversation_id: string | null;
  items: Record<string, unknown>[];
  next_cursor: string | null;
  usage: Record<string, unknown>;
}

export interface HealthAssistantMessage {
  id: string;
  role: "assistant";
  body: string;
  created_at: string;
}

export interface HealthAssistantReply {
  conversation_id: string;
  message: HealthAssistantMessage;
}

export interface HealthFileAccess {
  id: string;
  url: string;
  expires_at: string;
  data: Record<string, unknown>;
}

export interface HealthForm {
  response_id: string;
  questionnaire_id: string;
  version: number;
  questionnaire: Record<string, unknown>;
  answers: Record<string, unknown>;
  status: string;
  expires_at: string | null;
  submitted_at: string | null;
}

export interface HealthHome {
  from: string;
  to: string;
  activities: ActivityItem[];
  daily: Record<string, unknown>[];
  events: Record<string, unknown>[];
  reports: Record<string, unknown>[];
  files: Record<string, unknown>[];
  questionnaires: Record<string, unknown>[];
}

export interface HealthQuestionnaires {
  items: Record<string, unknown>[];
  responses: Record<string, unknown>[];
}

export interface HealthUpload {
  id: string;
  kind: string;
  status: "pending" | "ready" | "processing";
  url: string | null;
}

export interface HealthUploadInput {
  action: "prepare" | "complete";
  id: string | null;
  mime: string | null;
  bytes: number | null;
}

export interface HelpRequest {
  id: string;
  status: string;
  created_at: string;
}

export interface IdentityDeleteResult {
  ok: boolean;
}

export interface IdentitySession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: IdentitySessionUser;
}

export interface IdentitySessionUser {
  id: string;
  email: string | null;
}

export interface IdentitySignInResult {
  status: "signed_in" | "email_not_confirmed";
  email: string | null;
  session: IdentitySession | null;
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

export interface InteractionThread {
  target: Record<string, unknown>;
  items: Record<string, unknown>[];
  next_cursor: string | null;
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
  programs: ProgramSummary[];
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

export interface MediaUpload {
  fileId: string | null;
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
  bucket: string;
  uploaded: boolean;
  contentType: string;
  requestId: string;
  uploadHeaders?: Record<string, unknown>;
  expiresIn?: number;
}

export interface MediaUploadCompleted {
  fileId: string;
  publicUrl: string;
  ready: boolean;
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

export interface NutritionClientDiet {
  client_id: string;
  from: string;
  to: string;
  diet: Record<string, unknown> | null;
  days: Record<string, unknown>[];
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

export interface NutritionSwapSuggestions {
  meal_id: string;
  item_id: string;
  date: string;
  suggestions: Record<string, unknown>[];
  basis: "catalog" | "energy_range";
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

export interface OrgClient {
  id: string;
  account: Record<string, unknown>;
  stage: "lead" | "client" | "former";
  archived: boolean;
  purchases: Record<string, unknown>[];
  pending: Record<string, unknown>[];
  contracts: Record<string, unknown>[];
  tools: string[];
  history: Record<string, unknown>[];
}

export interface OrgClientAfterAction {
  id: string;
  account: Record<string, unknown>;
  stage: "lead" | "client" | "former";
  archived: boolean;
  purchases: Record<string, unknown>[];
  pending: Record<string, unknown>[];
  contracts: Record<string, unknown>[];
  tools: string[];
  history: Record<string, unknown>[];
}

export interface OrgClientCard {
  id: string;
  account: Record<string, unknown>;
  stage: "lead" | "client" | "former";
  archived: boolean;
  purchases: Record<string, unknown>[];
  pending: Record<string, unknown>[];
}

export interface OrgClientsResult {
  items: OrgClientCard[];
  next_cursor: string | null;
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
  origin: string;
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

export interface SocialChallenge {
  id: string;
  kind: "challenge";
  creator_id?: string;
  business_id?: string | null;
  community_id?: string | null;
  offer_id?: string | null;
  status: string;
  name: string;
  description?: string;
  image_url?: string | null;
  visibility?: string;
  access_mode: string;
  publishing?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  config: Record<string, unknown>;
  version?: number;
  members: number;
  my_membership: Record<string, unknown> | null;
}

export interface SocialChallengeAfterAction {
  id: string;
  kind: "challenge";
  creator_id?: string;
  business_id?: string | null;
  community_id?: string | null;
  offer_id?: string | null;
  status: string;
  name: string;
  description?: string;
  image_url?: string | null;
  visibility?: string;
  access_mode: string;
  publishing?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  config: Record<string, unknown>;
  version?: number;
  members: number;
  my_membership: Record<string, unknown> | null;
}

export interface SocialChallengeSaved {
  id: string;
  kind: "challenge";
  creator_id?: string;
  business_id?: string | null;
  community_id?: string | null;
  offer_id?: string | null;
  status: string;
  name: string;
  description?: string;
  image_url?: string | null;
  visibility?: string;
  access_mode: string;
  publishing?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  config: Record<string, unknown>;
  version?: number;
  members: number;
  my_membership: Record<string, unknown> | null;
}

export interface SocialChallenges {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface SocialCommunities {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface SocialCommunity {
  id: string;
  kind: "community";
  creator_id?: string;
  business_id?: string | null;
  community_id?: string | null;
  offer_id?: string | null;
  status: string;
  name: string;
  description?: string;
  image_url?: string | null;
  visibility?: string;
  access_mode: string;
  publishing?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  config: Record<string, unknown>;
  version?: number;
  members: number;
  my_membership: Record<string, unknown> | null;
}

export interface SocialCommunityAfterAction {
  id: string;
  kind: "community";
  creator_id?: string;
  business_id?: string | null;
  community_id?: string | null;
  offer_id?: string | null;
  status: string;
  name: string;
  description?: string;
  image_url?: string | null;
  visibility?: string;
  access_mode: string;
  publishing?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  config: Record<string, unknown>;
  version?: number;
  members: number;
  my_membership: Record<string, unknown> | null;
}

export interface SocialCommunitySaved {
  id: string;
  kind: "community";
  creator_id?: string;
  business_id?: string | null;
  community_id?: string | null;
  offer_id?: string | null;
  status: string;
  name: string;
  description?: string;
  image_url?: string | null;
  visibility?: string;
  access_mode: string;
  publishing?: string;
  starts_at?: string | null;
  ends_at?: string | null;
  config: Record<string, unknown>;
  version?: number;
  members: number;
  my_membership: Record<string, unknown> | null;
}

export interface SocialConversation {
  peer: Record<string, unknown> | null;
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface SocialExplore {
  items: Record<string, unknown>[];
  people: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface SocialFeed {
  items: SocialPost[];
  stories: SocialPost[];
  next_cursor: string | null;
}

export interface SocialImageOverlay {
  file_id: string;
  url: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export interface SocialImageOverlayInput {
  file_id: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export interface SocialInbox {
  items: Record<string, unknown>[];
  next_cursor: string | null;
  unread_count: number;
}

export interface SocialMedia {
  file_id: string;
  kind: "image" | "video";
  url: string;
  cover_file_id?: string | null;
  thumbnail_url?: string | null;
  stream_status?: string | null;
  hls_url?: string | null;
  duration_seconds?: number | null;
  aspect_ratio?: number | null;
  audio_mode?: "preserve" | "remove" | "absent" | null;
  framing?: SocialMediaFraming | null;
  text_overlays: SocialTextOverlay[];
  image_overlay?: SocialImageOverlay | null;
  user_tags: SocialUserTag[];
}

export interface SocialMediaFraming {
  fit: "contain" | "cover";
  zoom: number;
  offsetX: number;
  offsetY: number;
  version: number;
  intent: "automatic" | "authored";
}

export interface SocialMediaFramingInput {
  fit: "contain" | "cover";
  zoom: number;
  offsetX: number;
  offsetY: number;
  version: number;
  intent: "automatic" | "authored";
}

export interface SocialMediaInput {
  file_id: string;
  kind: "image" | "video";
  cover_file_id?: string | null;
  duration_seconds?: number | null;
  aspect_ratio?: number | null;
  audio_mode?: "preserve" | "remove" | "absent" | null;
  framing?: SocialMediaFramingInput | null;
  text_overlays: SocialTextOverlayInput[];
  image_overlay?: SocialImageOverlayInput | null;
  user_tags: SocialUserTagInput[];
}

export interface SocialNetworkIdentity {
  classification: "professional" | "associate" | "ambassador";
  badge_label?: string | null;
  affinity_group_key?: string | null;
  headline?: string | null;
  public_visible: boolean;
}

export interface SocialPost {
  id: string;
  kind: "post" | "story";
  author: SocialProfileReadCard;
  parent_id?: string | null;
  container_type?: string | null;
  container_id?: string | null;
  recipient_id?: string | null;
  expires_at?: string | null;
  status: string;
  visibility: string;
  body: string;
  content?: Record<string, unknown>;
  media: SocialMedia[];
  sports: string[];
  location?: string | null;
  offer_id?: string | null;
  affinity?: string | null;
  comments_enabled: boolean;
  like_count: number;
  comment_count: number;
  view_count: number;
  liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialPostInput {
  id?: string | null;
  idempotency_key?: string | null;
  status?: "draft" | "published";
  visibility: "public" | "followers" | "members" | "paid";
  body: string;
  media: SocialMediaInput[];
  sports: string[];
  location?: string | null;
  offer_id?: string | null;
  affinity?: string | null;
  comments_enabled: boolean;
  container_type?: "community" | "challenge" | null;
  container_id?: string | null;
}

export interface SocialPostLookup {
  found: boolean;
  id?: string | null;
}

export interface SocialPostSaved {
  id: string;
  kind: "post";
  author: SocialProfileCard;
  parent_id?: string | null;
  container_type?: string | null;
  container_id?: string | null;
  recipient_id?: string | null;
  expires_at?: string | null;
  status: string;
  visibility: string;
  body: string;
  content?: Record<string, unknown>;
  media: SocialMedia[];
  sports: string[];
  location?: string | null;
  offer_id?: string | null;
  affinity?: string | null;
  comments_enabled: boolean;
  like_count: number;
  comment_count: number;
  view_count: number;
  liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialProfile {
  profile: SocialProfileReadCard;
  posts: SocialPost[];
  stories: SocialPost[];
  next_cursor: string | null;
}

export interface SocialProfileCard {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  is_professional: boolean;
  following: boolean;
  followed_by: boolean;
  network_identity?: SocialNetworkIdentity | null;
}

export interface SocialProfileReadCard {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  is_professional: boolean;
  following: boolean;
  followed_by: boolean;
  network_identity?: SocialNetworkIdentity | null;
}

export interface SocialStories {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface SocialTextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  font: "modern" | "strong" | "classic" | "typewriter";
  color: number;
  background: "none" | "translucent" | "solid";
  background_color?: number | null;
  background_opacity?: number | null;
  align: "left" | "right" | "center" | "justify" | "start" | "end";
  size: number;
  rotation: number;
}

export interface SocialTextOverlayInput {
  id: string;
  text: string;
  x: number;
  y: number;
  font: "modern" | "strong" | "classic" | "typewriter";
  color: number;
  background: "none" | "translucent" | "solid";
  background_color?: number | null;
  background_opacity?: number | null;
  align: "left" | "right" | "center" | "justify" | "start" | "end";
  size: number;
  rotation: number;
}

export interface SocialUserTag {
  user_id: string;
  username: string;
  display_name: string;
  x: number;
  y: number;
}

export interface SocialUserTagInput {
  user_id: string;
  x: number;
  y: number;
}

export interface Sport {
  id: string;
  name_key: string;
  engine: "strength" | "endurance" | "crossfit" | "hyrox" | "combat" | "mobility" | "custom";
  affinity_group_id: string | null;
}

export interface StaffAccount {
  account: Record<string, unknown>;
  businesses: Record<string, unknown>[];
  purchases: Record<string, unknown>[];
  mail: Record<string, unknown>[];
}

export interface StaffAccounts {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface StaffAudit {
  items: Record<string, unknown>[];
  next_cursor: number | null;
}

export interface StaffCatalog {
  kind: string;
  can_edit: boolean;
  items: Record<string, unknown>[];
}

export interface StaffDashboard {
  section: string;
  from: string;
  to: string;
  metrics: Record<string, unknown>[];
  totals: Record<string, unknown>;
}

export interface StaffFeedSettings {
  followed_slots: number;
  discovery_slots: number;
  version: number;
}

export interface StaffMail {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface StaffQueue {
  items: Record<string, unknown>[];
  next_cursor: string | null;
}

export interface StaffSetting {
  key: string;
  version: number;
  values: Record<string, unknown>;
}

export interface StaffSettings {
  can_edit: boolean;
  items: Record<string, unknown>[];
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

export interface TrainingClientPlan {
  client_id: string;
  week_start: string;
  programs: Record<string, unknown>[];
  days: Record<string, unknown>[];
}

export interface TrainingClientProgramResult {
  program: Record<string, unknown>;
  plan: Record<string, unknown>;
}

export interface TrainingDay {
  date: string;
  workouts: ScheduledWorkout[];
}

export interface TrainingProgramDayInput {
  week: number;
  weekday: number;
  workout_id: string;
}

export interface TrainingProgramModel {
  id: string;
  business_id: string;
  title: string;
  sport_id: string;
  weeks: number;
  days: Record<string, unknown>[];
  status: string;
  updated_at: string;
  assigned_clients: number;
}

export interface TrainingProgramSaveInput {
  id?: string;
  business_id: string;
  title: string;
  sport_id: string;
  weeks: number;
  days: TrainingProgramDayInput[];
  idempotency_key: string;
}

export interface UnlinkedActivity {
  id: string;
  activity_type: string | null;
}

export interface UploadFailureRecorded {
  ok: boolean;
}

export interface VideoFinalized {
  fileId: string;
  publicUrl: string;
  objectKey: string;
  contentType: string;
  audioMode: string;
  hasAudio: boolean;
  container: "iso-bmff" | "webm" | "ogg";
  attested: boolean;
}

export interface VideoUpload {
  uploadId: string;
  uploadUrl: string;
  contentType: string;
  contentLength: number;
  audioMode: string;
  uploadHeaders: Record<string, unknown>;
  expiresIn: number;
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

const missingEdgeTransport: EdgeTransport = async () => { throw new Error('core.edge_transport_required'); };

export function createApi(call: Transport, invoke: EdgeTransport = missingEdgeTransport) {
  return {
    app: {
      /** Todos os catálogos do app numa leitura. Mande a versão que o app já tem: se nada mudou, vem changed = false e sem catálogos. (query; contract/app/catalogs.v1.json) */
      catalogs: (input: { version?: string } = {}) => call('app_catalogs_v1', { p_version: input.version }) as Promise<CatalogsResponse>,
      /** Grava a telemetria em lote (até 200 eventos). Reenviar não duplica; evento com mais de 7 dias é recusado. (command; contract/app/events_save.v1.json) */
      eventsSave: (input: { events: Record<string, unknown>[] }) => call('app_events_save_v1', { p_events: input.events }) as Promise<EventsSaved>,
    },
    commerce: {
      /** Solicita reserva de mídia para revisão comercial. (command; contract/commerce/ad_book.v1.json) */
      adBook: (input: { booking: CommerceAdBookingInput }) => call('commerce_ad_book_v1', { p_booking: input.booking }) as Promise<CommerceAdBooking>,
      /** Agenda remoção segura de um meio de pagamento tokenizado. (command; contract/commerce/card_act.v1.json) */
      cardAct: (input: { action: "remove"; paymentMethodReference: string }) => call('commerce_card_act_v1', { p_action: input.action, p_payment_method_reference: input.paymentMethodReference }) as Promise<CommerceCardAction>,
      /** Congela a oferta e inicia ou confirma um checkout idempotente. (command; contract/commerce/checkout.v1.json) */
      checkout: (input: { offerId: string; channel: "free" | "stripe_card"; idempotencyKey: string; acceptances: CommerceAcceptance[] }) => invoke('worker', '/commerce/checkout', { offer_id: input.offerId, channel: input.channel, idempotency_key: input.idempotencyKey, acceptances: input.acceptances }) as Promise<CommerceCheckoutResult>,
      /** Entrega conteúdo comprado e seu progresso. (query; contract/commerce/content.v1.json) */
      content: (input: { purchaseId: string }) => call('commerce_content_v1', { p_purchase_id: input.purchaseId }) as Promise<CommerceContent>,
      /** Lista ofertas publicadas de todos os tipos configurados. (query; contract/commerce/market.v1.json) */
      market: (input: { query?: string | null; type?: string | null; cursor?: string | null; limit?: number } = {}) => call('commerce_market_v1', { p_query: input.query, p_type: input.type, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommerceMarket>,
      /** Lista compradores confirmados de um negócio. (query; contract/commerce/members.v1.json) */
      members: (input: { businessId: string; cursor?: string | null; limit?: number }) => call('commerce_members_v1', { p_business_id: input.businessId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommerceMembers>,
      /** Lista vínculos da rede comercial. (query; contract/commerce/network.v1.json) */
      network: (input: { tab?: "mine" | "discover" } = {}) => call('commerce_network_v1', { p_tab: input.tab }) as Promise<CommerceNetwork>,
      /** Solicita, decide ou encerra vínculo na rede. (command; contract/commerce/network_act.v1.json) */
      networkAct: (input: { action: "request" | "approve" | "reject" | "leave"; containerId: string; targetId?: string | null; data?: CommerceNetworkActionData }) => call('commerce_network_act_v1', { p_action: input.action, p_container_id: input.containerId, p_target_id: input.targetId, p_data: input.data }) as Promise<CommerceNetworkMembership>,
      /** Lê uma oferta pública ou administrada. (query; contract/commerce/offer.v1.json) */
      offer: (input: { offerId: string }) => call('commerce_offer_v1', { p_offer_id: input.offerId }) as Promise<CommerceOffer>,
      /** Publica, pausa, retoma ou arquiva uma oferta. (command; contract/commerce/offer_act.v1.json) */
      offerAct: (input: { offerId: string; action: "ready" | "publish" | "pause" | "resume" | "archive"; expectedVersion: number }) => call('commerce_offer_act_v1', { p_offer_id: input.offerId, p_action: input.action, p_expected_version: input.expectedVersion }) as Promise<Record<string, unknown>>,
      /** Cria ou altera qualquer oferta segundo seu tipo configurado. (command; contract/commerce/offer_save.v1.json) */
      offerSave: (input: { offer: CommerceOfferSaveInput }) => call('commerce_offer_save_v1', { p_offer: input.offer }) as Promise<Record<string, unknown>>,
      /** Lista ofertas geridas por um negócio. (query; contract/commerce/offers.v1.json) */
      offers: (input: { businessId: string; status?: string | null }) => call('commerce_offers_v1', { p_business_id: input.businessId, p_status: input.status }) as Promise<CommerceOffers>,
      /** Avança a separação e entrega de pedido físico. (command; contract/commerce/order_act.v1.json) */
      orderAct: (input: { purchaseId: string; action: "prepare" | "ship" | "deliver" | "cancel"; data: CommerceOrderAction; expectedVersion: number }) => call('commerce_order_act_v1', { p_purchase_id: input.purchaseId, p_action: input.action, p_data: input.data, p_expected_version: input.expectedVersion }) as Promise<Record<string, unknown>>,
      /** Lista pedidos físicos de um negócio. (query; contract/commerce/orders.v1.json) */
      orders: (input: { businessId: string; status?: string | null; cursor?: string | null; limit?: number }) => call('commerce_orders_v1', { p_business_id: input.businessId, p_status: input.status, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommerceOrders>,
      /** Lista cobranças do negócio sem dados secretos do meio de pagamento. (query; contract/commerce/payments.v1.json) */
      payments: (input: { businessId: string; cursor?: string | null; limit?: number }) => call('commerce_payments_v1', { p_business_id: input.businessId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommercePayments>,
      /** Solicita repasse sem persistir a chave bancária em claro. (command; contract/commerce/payout.v1.json) */
      payout: (input: { businessId: string; amount: number; currency: string; destination: CommercePayoutDestination; idempotencyKey: string }) => call('commerce_payout_v1', { p_business_id: input.businessId, p_amount: input.amount, p_currency: input.currency, p_destination: input.destination, p_idempotency_key: input.idempotencyKey }) as Promise<CommercePayout>,
      /** Salva progresso de curso com concorrência otimista. (command; contract/commerce/progress_save.v1.json) */
      progressSave: (input: { purchaseId: string; progress: CommerceProgressInput; expectedVersion: number }) => call('commerce_progress_save_v1', { p_purchase_id: input.purchaseId, p_progress: input.progress, p_expected_version: input.expectedVersion }) as Promise<CommerceProgress>,
      /** Lê compra, entrega, progresso e cobranças autorizadas. (query; contract/commerce/purchase.v1.json) */
      purchase: (input: { purchaseId: string }) => call('commerce_purchase_v1', { p_purchase_id: input.purchaseId }) as Promise<CommercePurchase>,
      /** Cancela ou repete uma compra ainda não confirmada. (command; contract/commerce/purchase_act.v1.json) */
      purchaseAct: (input: { purchaseId: string; action: "cancel" | "retry"; expectedVersion: number }) => call('commerce_purchase_act_v1', { p_purchase_id: input.purchaseId, p_action: input.action, p_expected_version: input.expectedVersion }) as Promise<Record<string, unknown>>,
      /** Lista compras do titular. (query; contract/commerce/purchases.v1.json) */
      purchases: (input: { status?: string | null; cursor?: string | null; limit?: number } = {}) => call('commerce_purchases_v1', { p_status: input.status, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommercePurchases>,
      /** Consulta saldos derivados do razão e repasses. (query; contract/commerce/wallet.v1.json) */
      wallet: (input: { businessId: string }) => call('commerce_wallet_v1', { p_business_id: input.businessId }) as Promise<CommerceWallet>,
    },
    health: {
      /** Histórico privado e uso do assistente. (query; contract/health/assistant.v1.json) */
      assistant: (input: { conversationId?: string; cursor?: string; limit?: number } = {}) => call('health_assistant_v1', { p_conversation_id: input.conversationId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<HealthAssistant>,
      /** Pergunta ao assistente não diagnóstico usando apenas o histórico da conversa. (command; contract/health/assistant_ask.v1.json) */
      assistantAsk: (input: { conversationId?: string; message: string }) => invoke('worker', '/health/assistant', { conversation_id: input.conversationId, message: input.message }) as Promise<HealthAssistantReply>,
      /** Dossiê consentido do cliente para profissional autorizado. (query; contract/health/client_record.v1.json) */
      clientRecord: (input: { businessId: string; clientId: string; from?: string; to?: string }) => call('health_client_record_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_from: input.from, p_to: input.to }) as Promise<Record<string, unknown>>,
      /** Registra fato de saúde imutável ou sua correção. (command; contract/health/event_save.v1.json) */
      eventSave: (input: { event: Record<string, unknown> }) => call('health_event_save_v1', { p_event: input.event }) as Promise<Record<string, unknown>>,
      /** Abre arquivo de saúde por URL assinada curta. (query; contract/health/file.v1.json) */
      file: (input: { id: string }) => invoke('worker', '/health/file', { id: input.id }) as Promise<HealthFileAccess>,
      /** Confirma extração ou exclui arquivo de Saúde. (command; contract/health/file_act.v1.json) */
      fileAct: (input: { id: string; action: "confirmExtraction" | "delete" }) => call('health_file_act_v1', { p_id: input.id, p_action: input.action }) as Promise<Record<string, unknown>>,
      /** Abre questionário atribuído ou link público. (query; contract/health/form.v1.json) */
      form: (input: { questionnaireId?: string; token?: string } = {}) => call('health_form_v1', { p_questionnaire_id: input.questionnaireId, p_token: input.token }) as Promise<HealthForm>,
      /** Salva rascunho ou envia resposta na versão recebida. (command; contract/health/form_save.v1.json) */
      formSave: (input: { responseId: string; token?: string; answers?: Record<string, unknown>; submit?: boolean }) => call('health_form_save_v1', { p_response_id: input.responseId, p_token: input.token, p_answers: input.answers, p_submit: input.submit }) as Promise<Record<string, unknown>>,
      /** Painel privado de Saúde no período, incluindo o histórico unificado de atividades. (query; contract/health/home.v1.json) */
      home: (input: { from?: string; to?: string } = {}) => call('health_home_v1', { p_from: input.from, p_to: input.to }) as Promise<HealthHome>,
      /** Configura entrega, envia, cria link ou arquiva questionário. (command; contract/health/questionnaire_act.v1.json) */
      questionnaireAct: (input: { id: string; action: "setDeliveryRule" | "send" | "createLink" | "archive"; data?: Record<string, unknown> }) => call('health_questionnaire_act_v1', { p_id: input.id, p_action: input.action, p_data: input.data }) as Promise<Record<string, unknown>>,
      /** Salva modelo; edição respondida cria nova versão. (command; contract/health/questionnaire_save.v1.json) */
      questionnaireSave: (input: { questionnaire: Record<string, unknown> }) => call('health_questionnaire_save_v1', { p_questionnaire: input.questionnaire }) as Promise<Record<string, unknown>>,
      /** Modelos, entregas e respostas do negócio. (query; contract/health/questionnaires.v1.json) */
      questionnaires: (input: { businessId: string }) => call('health_questionnaires_v1', { p_business_id: input.businessId }) as Promise<HealthQuestionnaires>,
      /** Salva relatório; publicado vira versão imutável. (command; contract/health/report_save.v1.json) */
      reportSave: (input: { report: Record<string, unknown> }) => call('health_report_save_v1', { p_report: input.report }) as Promise<Record<string, unknown>>,
      /** Prepara e confirma upload assinado em armazenamento privado. (command; contract/health/upload.v1.json) */
      upload: (input: { file: HealthUploadInput; kind: "health_document" | "progress_photo" }) => invoke('worker', '/health/upload', { file: input.file, kind: input.kind }) as Promise<HealthUpload>,
    },
    identity: {
      /** applyCode: usa o código de indicação de outra pessoa para sair da fila. Devolve o veredito de acesso. (command; contract/identity/access_act.v1.json) */
      accessAct: (input: { action: "applyCode"; code?: string }) => call('identity_access_act_v1', { p_action: input.action, p_code: input.code }) as Promise<Access>,
      /** Tudo o que o app precisa ao abrir: conta, dados privados, preferências, interesses, endereços, veredito de acesso, onboarding, termos pendentes e situação do documento. (query; contract/identity/bootstrap.v1.json) */
      bootstrap: () => call('identity_bootstrap_v1', {}) as Promise<Bootstrap>,
      /** Exclui a própria conta e agenda a remoção segura dos seus arquivos externos. (command; contract/identity/delete.v1.json) */
      delete: () => invoke('auth', '/delete', {}) as Promise<IdentityDeleteResult>,
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
      /** Entra com e-mail ou @usuário sem expor o endereço resolvido quando a credencial é inválida. (command; contract/identity/sign_in.v1.json) */
      signIn: (input: { identifier: string; password: string }) => invoke('auth', '/sign-in', { identifier: input.identifier, password: input.password }) as Promise<IdentitySignInResult>,
    },
    nutrition: {
      /** Calendário de Nutrição (J16.57/58): por dia, refeições previstas, feitas, não feitas e refeições livres. (query; contract/nutrition/calendar.v1.json) */
      calendar: (input: { from: string; to: string }) => call('nutrition_calendar_v1', { p_from: input.from, p_to: input.to }) as Promise<NutritionCalendarDay[]>,
      /** Lê a dieta ativa e a adesão do cliente sem incluir refeições livres. (query; contract/nutrition/client_diet.v1.json) */
      clientDiet: (input: { businessId: string; clientId: string; from?: string; to?: string }) => call('nutrition_client_diet_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_from: input.from, p_to: input.to }) as Promise<NutritionClientDiet>,
      /** O dia de Nutrição: dieta ativa, marcação e edição de cada refeição no dia e refeições livres. (query; contract/nutrition/day.v1.json) */
      day: (input: { date?: string } = {}) => call('nutrition_day_v1', { p_date: input.date }) as Promise<NutritionDay>,
      /** Detalhe da dieta: refeições, itens, metas e quem prescreveu. (query; contract/nutrition/diet.v1.json) */
      diet: (input: { dietId: string }) => call('nutrition_diet_v1', { p_diet_id: input.dietId }) as Promise<Diet>,
      /** apply (ativa; da OnlyFit Health cria a cópia uma vez, J16.50/88) · remove (tira da biblioteca) · mealTime (horário, J16.52). Devolve a biblioteca. (command; contract/nutrition/diet_act.v1.json) */
      dietAct: (input: { dietId: string; action: "apply" | "remove" | "mealTime"; input?: DietActionInput }) => call('nutrition_diet_act_v1', { p_diet_id: input.dietId, p_action: input.action, p_input: input.input }) as Promise<DietLibrary>,
      /** Salva a dieta própria inteira (cria com idempotency_key ou substitui). Metas somadas dos itens. (command; contract/nutrition/diet_save.v1.json) */
      dietSave: (input: { diet: DietSaveInput }) => call('nutrition_diet_save_v1', { p_diet: input.diet }) as Promise<Diet>,
      /** Cria, altera ou remove alimento pessoal validado. (command; contract/nutrition/food_save.v1.json) */
      foodSave: (input: { food: FoodSaveInput }) => call('nutrition_food_save_v1', { p_food: input.food }) as Promise<Record<string, unknown>>,
      /** Busca de alimentos: começo do nome e bases comuns (TACO, TBCA) primeiro; pessoais só para quem criou; código de barras exato. (query; contract/nutrition/food_search.v1.json) */
      foodSearch: (input: { query?: string; barcode?: string; limit?: number; offset?: number } = {}) => call('nutrition_food_search_v1', { p_query: input.query, p_barcode: input.barcode, p_limit: input.limit, p_offset: input.offset }) as Promise<Food[]>,
      /** Refeição livre (J16.37–40): já consumida, só o título é obrigatório, sem horário inventado; criar, editar e excluir só hoje e ontem. Devolve o dia. (command; contract/nutrition/free_meal_save.v1.json) */
      freeMealSave: (input: { meal: FreeMealInput }) => call('nutrition_free_meal_save_v1', { p_meal: input.meal }) as Promise<NutritionDay>,
      /** Biblioteca de dietas: própria, comprada, prescrita e OnlyFit Health (ler não cria cópia), com a ativa. (query; contract/nutrition/library.v1.json) */
      library: () => call('nutrition_library_v1', {}) as Promise<DietLibrary>,
      /** mark (feito | não feito com motivo, J16.22) · unmark — hoje e ontem; edit/remove só neste dia (J16.67), qualquer data. Devolve o dia. (command; contract/nutrition/meal_act.v1.json) */
      mealAct: (input: { mealId: string; action: "mark" | "unmark" | "edit" | "remove"; date?: string; input?: MealActionInput }) => call('nutrition_meal_act_v1', { p_meal_id: input.mealId, p_action: input.action, p_date: input.date, p_input: input.input }) as Promise<NutritionDay>,
      /** Sugere trocas determinísticas por equivalência energética no catálogo autorizado. (query; contract/nutrition/swap_suggest.v1.json) */
      swapSuggest: (input: { mealId: string; itemId: string; date?: string | null; limit?: number }) => call('nutrition_swap_suggest_v1', { p_meal_id: input.mealId, p_item_id: input.itemId, p_date: input.date, p_limit: input.limit }) as Promise<NutritionSwapSuggestions>,
    },
    org: {
      /** Lista os negócios, compõe perfil e equipe e pesquisa profissionais elegíveis para convite. (query; contract/org/business.v1.json) */
      business: (input: { businessId?: string; search?: string } = {}) => call('org_business_v1', { p_business_id: input.businessId, p_search: input.search }) as Promise<BusinessScreen>,
      /** Publica, pausa, retoma, arquiva, restaura, exclui ou reenvia um negócio. (command; contract/org/business_act.v1.json) */
      businessAct: (input: { businessId: string; action: "publish" | "pause" | "resume" | "archive" | "restore" | "delete" | "resubmit" }) => call('org_business_act_v1', { p_business_id: input.businessId, p_action: input.action }) as Promise<BusinessActionResult>,
      /** Cria ou substitui atomicamente o perfil inteiro do negócio. (command; contract/org/business_save.v1.json) */
      businessSave: (input: { business: BusinessSaveInput }) => call('org_business_save_v1', { p_business: input.business }) as Promise<BusinessSaveResult>,
      /** Abre a ficha comercial única e libera somente as ferramentas consentidas. (query; contract/org/client.v1.json) */
      client: (input: { businessId: string; clientId: string }) => call('org_client_v1', { p_business_id: input.businessId, p_client_id: input.clientId }) as Promise<OrgClient>,
      /** Arquiva a ficha ou administra pedidos de acesso sem transformar cliente em papel. (command; contract/org/client_act.v1.json) */
      clientAct: (input: { businessId: string; clientId: string; action: "archive" | "restore" | "requestAccess" | "renounceAccess"; items?: ("training" | "diet" | "protocols" | "health")[]; reason?: string }) => call('org_client_act_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_action: input.action, p_items: input.items, p_reason: input.reason }) as Promise<OrgClientAfterAction>,
      /** Lista paginada do CRM com estágio apurado por compras e contratos. (query; contract/org/clients.v1.json) */
      clients: (input: { businessId: string; view?: "all" | "lead" | "client" | "former" | "archived"; search?: string; cursor?: string; limit?: number }) => call('org_clients_v1', { p_business_id: input.businessId, p_view: input.view, p_search: input.search, p_cursor: input.cursor, p_limit: input.limit }) as Promise<OrgClientsResult>,
      /** Permite ao titular autorizar, negar ou revogar itens de acesso do contrato de consultoria. (command; contract/org/consent_decide.v1.json) */
      consentDecide: (input: { contractId: string; action: "allow" | "deny" | "revoke"; items: ("training" | "diet" | "protocols" | "health")[] }) => call('org_consent_decide_v1', { p_contract_id: input.contractId, p_action: input.action, p_items: input.items }) as Promise<ConsultancyConsentResult>,
      /** Encerra imediatamente um contrato de consultoria por uma das partes e remove seus acessos. (command; contract/org/contract_end.v1.json) */
      contractEnd: (input: { contractId: string; reason: string }) => call('org_contract_end_v1', { p_contract_id: input.contractId, p_reason: input.reason }) as Promise<ConsultancyContractEndResult>,
      /** Prepara a contratação de uma consultoria com partes, escopo e documentos vigentes validados no servidor. (query; contract/org/hire_prepare.v1.json) */
      hirePrepare: (input: { offerId: string }) => call('org_hire_prepare_v1', { p_offer_id: input.offerId }) as Promise<ConsultancyHirePreparation>,
      /** Convida, aceita, recusa, muda o nível de acesso ou remove uma pessoa da equipe. (command; contract/org/team_act.v1.json) */
      teamAct: (input: { businessId: string; action: "invite" | "accept" | "decline" | "setAccess" | "remove"; input?: TeamActionInput }) => call('org_team_act_v1', { p_business_id: input.businessId, p_action: input.action, p_input: input.input }) as Promise<TeamActionResult>,
    },
    social: {
      /** Abre uma edição de desafio e o progresso congelável do participante. (query; contract/social/challenge.v1.json) */
      challenge: (input: { id: string }) => call('social_challenge_v1', { p_id: input.id }) as Promise<SocialChallenge>,
      /** Publica pelo criador e administra participação, encerramento ou cancelamento. (command; contract/social/challenge_act.v1.json) */
      challengeAct: (input: { id: string; action: "publish" | "join" | "leave" | "approve" | "reject" | "cancel" | "end"; targetId?: string; data?: Record<string, unknown> }) => call('social_challenge_act_v1', { p_id: input.id, p_action: input.action, p_target_id: input.targetId, p_data: input.data }) as Promise<SocialChallengeAfterAction>,
      /** Salva desafio avulso gratuito/pago ou desafio nativo de comunidade. (command; contract/social/challenge_save.v1.json) */
      challengeSave: (input: { challenge: Record<string, unknown> }) => call('social_challenge_save_v1', { p_challenge: input.challenge }) as Promise<SocialChallengeSaved>,
      /** Lista desafios gratuitos ou pagos com acesso e progresso atuais. (query; contract/social/challenges.v1.json) */
      challenges: (input: { tab?: "discover" | "mine" | "history"; cursor?: string; limit?: number } = {}) => call('social_challenges_v1', { p_tab: input.tab, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialChallenges>,
      /** Lista comunidades descobríveis, atuais ou históricas. (query; contract/social/communities.v1.json) */
      communities: (input: { tab?: "discover" | "mine" | "history"; cursor?: string; limit?: number } = {}) => call('social_communities_v1', { p_tab: input.tab, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialCommunities>,
      /** Abre uma comunidade com sua política efetiva de acesso. (query; contract/social/community.v1.json) */
      community: (input: { id: string }) => call('social_community_v1', { p_id: input.id }) as Promise<SocialCommunity>,
      /** Publica, administra entrada ou encerra uma comunidade. (command; contract/social/community_act.v1.json) */
      communityAct: (input: { id: string; action: "publish" | "pauseEntry" | "archive" | "join" | "leave" | "approve" | "reject"; targetId?: string; data?: Record<string, unknown> }) => call('social_community_act_v1', { p_id: input.id, p_action: input.action, p_target_id: input.targetId, p_data: input.data }) as Promise<SocialCommunityAfterAction>,
      /** Cria ou edita comunidade gratuita ou paga, sem permitir trocar a política após a primeira entrada. (command; contract/social/community_save.v1.json) */
      communitySave: (input: { community: Record<string, unknown> }) => call('social_community_save_v1', { p_community: input.community }) as Promise<SocialCommunitySaved>,
      /** Mensagens privadas com uma pessoa. (query; contract/social/conversation.v1.json) */
      conversation: (input: { peerId: string; cursor?: string; limit?: number }) => call('social_conversation_v1', { p_peer_id: input.peerId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialConversation>,
      /** Inspeciona a capa em quarentena e a publica no bucket de miniaturas; a escolha (quadro ou galeria) fica imutável. (command; contract/social/cover_prepare.v1.json) */
      coverPrepare: (input: { uploadId: string; source: "frame" | "gallery"; frameTimeSeconds?: number }) => invoke('worker', '/media/cover-prepare', { upload_id: input.uploadId, source: input.source, frame_time_seconds: input.frameTimeSeconds }) as Promise<CoverPrepared>,
      /** Abre a quarentena de uma capa JPEG escolhida pelo autor. (command; contract/social/cover_upload.v1.json) */
      coverUpload: (input: { contentLength: number }) => invoke('worker', '/media/cover-upload', { content_length: input.contentLength }) as Promise<CoverUpload>,
      /** Explora conteúdo de criadores e busca pessoas. (query; contract/social/explore.v1.json) */
      explore: (input: { search?: string; affinity?: string; cursor?: string; limit?: number } = {}) => call('social_explore_v1', { p_search: input.search, p_affinity: input.affinity, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialExplore>,
      /** Feed por cursor, com seguidos e descoberta sem duplicação. (query; contract/social/feed.v1.json) */
      feed: (input: { sports?: string[]; cursor?: string; limit?: number } = {}) => call('social_feed_v1', { p_sports: input.sports, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialFeed>,
      /** Segue, deixa de seguir, bloqueia ou desbloqueia. (command; contract/social/follow_act.v1.json) */
      followAct: (input: { accountId: string; action: "follow" | "unfollow" | "block" | "unblock" }) => call('social_follow_act_v1', { p_account_id: input.accountId, p_action: input.action }) as Promise<Record<string, unknown>>,
      /** Central de conversas ou notificações. (query; contract/social/inbox.v1.json) */
      inbox: (input: { tab?: "messages" | "notifications"; cursor?: string; limit?: number } = {}) => call('social_inbox_v1', { p_tab: input.tab, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialInbox>,
      /** Envia, compartilha, lê ou exclui mensagem privada. (command; contract/social/message_act.v1.json) */
      messageAct: (input: { recipientIds: string[]; action: "send" | "share" | "markRead" | "delete"; data?: Record<string, unknown> }) => call('social_message_act_v1', { p_recipient_ids: input.recipientIds, p_action: input.action, p_data: input.data }) as Promise<Record<string, unknown>>,
      /** Marca notificações sem confundir badge com leitura. (command; contract/social/notification_act.v1.json) */
      notificationAct: (input: { ids?: string[]; action?: "markRead" | "markAllRead" | "clearBadge" } = {}) => call('social_notification_act_v1', { p_ids: input.ids, p_action: input.action }) as Promise<Record<string, unknown>>,
      /** Abre publicação visível com interação atual. (query; contract/social/post.v1.json) */
      post: (input: { id: string }) => call('social_post_v1', { p_id: input.id }) as Promise<SocialPost>,
      /** Localiza uma publicação própria pela chave idempotente antes de repetir uploads. (query; contract/social/post_lookup.v1.json) */
      postLookup: (input: { idempotencyKey: string }) => call('social_post_lookup_v1', { p_idempotency_key: input.idempotencyKey }) as Promise<SocialPostLookup>,
      /** Cria ou edita uma publicação idempotente e vincula somente mídias prontas do autor. (command; contract/social/post_save.v1.json) */
      postSave: (input: { post: SocialPostInput }) => call('social_post_save_v1', { p_post: input.post }) as Promise<SocialPostSaved>,
      /** Perfil público, publicações e stories ativos. (query; contract/social/profile.v1.json) */
      profile: (input: { username: string; cursor?: string; limit?: number }) => call('social_profile_v1', { p_username: input.username, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialProfile>,
      /** Stories ativos e visíveis agrupáveis por autor. (query; contract/social/stories.v1.json) */
      stories: (input: { authorId?: string; cursor?: string; limit?: number } = {}) => call('social_stories_v1', { p_author_id: input.authorId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialStories>,
      /** Registra visualização ou muda o estado do story. (command; contract/social/story_act.v1.json) */
      storyAct: (input: { ids: string[]; action: "view" | "toggleComments" | "convertToPost" | "delete"; data?: Record<string, unknown> }) => call('social_story_act_v1', { p_ids: input.ids, p_action: input.action, p_data: input.data }) as Promise<Record<string, unknown>>,
      /** Publica story por 24 horas. (command; contract/social/story_save.v1.json) */
      storySave: (input: { story: Record<string, unknown> }) => call('social_story_save_v1', { p_story: input.story }) as Promise<Record<string, unknown>>,
      /** URL assinada para enviar foto, áudio, miniatura, avatar ou mídia de story direto ao R2 (vídeo de post usa social.videoUpload). (command; contract/social/upload.v1.json) */
      upload: (input: { filename: string; contentType: string; targetBucket?: "onlyfit-media" | "onlyfit-thumbnails" | "onlyfit-avatar" | "onlyfit-stories" | "onlyfit-private"; contentLength: number; requestId?: string; tenantId?: string; docKind?: string }) => invoke('worker', '/media/upload-url', { filename: input.filename, content_type: input.contentType, target_bucket: input.targetBucket, content_length: input.contentLength, request_id: input.requestId, tenant_id: input.tenantId, doc_kind: input.docKind }) as Promise<MediaUpload>,
      /** Confirma no R2 tamanho e MIME do upload direto antes de liberar o arquivo para publicação. (command; contract/social/upload_complete.v1.json) */
      uploadComplete: (input: { fileId: string }) => invoke('worker', '/media/upload-complete', { file_id: input.fileId }) as Promise<MediaUploadCompleted>,
      /** Relata uma falha de envio de mídia sem URL nem dado pessoal (telemetria). (command; contract/social/upload_failure.v1.json) */
      uploadFailure: (input: { uploadId?: string; stage: string; providerCode?: string; httpStatus?: number }) => invoke('worker', '/media/upload-failure', { upload_id: input.uploadId, stage: input.stage, provider_code: input.providerCode, http_status: input.httpStatus }) as Promise<UploadFailureRecorded>,
      /** Inspeciona o vídeo em quarentena (trilhas de áudio), publica no bucket de mídia e agenda o Cloudflare Stream. Repetir devolve o mesmo resultado. (command; contract/social/video_finalize.v1.json) */
      videoFinalize: (input: { uploadId: string }) => invoke('worker', '/media/video-finalize', { upload_id: input.uploadId }) as Promise<VideoFinalized>,
      /** Abre a quarentena de um vídeo de post e devolve a URL assinada para enviar o arquivo. (command; contract/social/video_upload.v1.json) */
      videoUpload: (input: { filename: string; contentType: "video/mp4" | "video/webm" | "video/quicktime" | "video/x-m4v" | "video/ogg"; contentLength: number; audioMode: "preserve" | "remove" | "absent" }) => invoke('worker', '/media/video-upload', { filename: input.filename, content_type: input.contentType, content_length: input.contentLength, audio_mode: input.audioMode }) as Promise<VideoUpload>,
    },
    interaction: {
      /** Curtir, comentar, responder, excluir ou denunciar. (command; contract/social/interaction_act.v1.json) */
      act: (input: { targetId: string; action: "like" | "unlike" | "comment" | "reply" | "delete" | "report"; data?: Record<string, unknown> }) => call('interaction_act_v1', { p_target_id: input.targetId, p_action: input.action, p_data: input.data }) as Promise<Record<string, unknown>>,
      /** Thread única para comentários de qualquer conteúdo. (query; contract/social/interaction_thread.v1.json) */
      thread: (input: { targetId: string; cursor?: string; limit?: number }) => call('interaction_thread_v1', { p_target_id: input.targetId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<InteractionThread>,
    },
    staff: {
      /** Cadastro operacional sem segredos. (query; contract/staff/account.v1.json) */
      account: (input: { id: string }) => call('staff_account_v1', { p_id: input.id }) as Promise<StaffAccount>,
      /** Redefine acesso ou papel interno com segregação. (command; contract/staff/account_act.v1.json) */
      accountAct: (input: { id: string; action: "resetPassword" | "resetMfa" | "setStaffRole" | "removeFromStaff"; data?: Record<string, unknown> }) => call('staff_account_act_v1', { p_id: input.id, p_action: input.action, p_data: input.data }) as Promise<Record<string, unknown>>,
      /** Busca pessoas por cursor e filtro operacional. (query; contract/staff/accounts.v1.json) */
      accounts: (input: { search?: string; filter?: "all" | "staff" | "professional" | "inactive"; cursor?: string; limit?: number } = {}) => call('staff_accounts_v1', { p_search: input.search, p_filter: input.filter, p_cursor: input.cursor, p_limit: input.limit }) as Promise<StaffAccounts>,
      /** Auditoria append-only filtrada. (query; contract/staff/audit.v1.json) */
      audit: (input: { actorId?: string; targetType?: string; targetId?: string; from?: string; to?: string; cursor?: number; limit?: number } = {}) => call('staff_audit_v1', { p_actor_id: input.actorId, p_target_type: input.targetType, p_target_id: input.targetId, p_from: input.from, p_to: input.to, p_cursor: input.cursor, p_limit: input.limit }) as Promise<StaffAudit>,
      /** Lê qualquer catálogo com inativos e impacto. (query; contract/staff/catalog.v1.json) */
      catalog: (input: { kind: string }) => call('staff_catalog_v1', { p_kind: input.kind }) as Promise<StaffCatalog>,
      /** Ativa, desativa ou ordena item após revalidar impacto. (command; contract/staff/catalog_act.v1.json) */
      catalogAct: (input: { kind: string; key: string; action: "activate" | "deactivate" | "reorder"; data?: Record<string, unknown> }) => call('staff_catalog_act_v1', { p_kind: input.kind, p_key: input.key, p_action: input.action, p_data: input.data }) as Promise<Record<string, unknown>>,
      /** Salva item inteiro com concorrência otimista. (command; contract/staff/catalog_save.v1.json) */
      catalogSave: (input: { kind: string; item: Record<string, unknown> }) => call('staff_catalog_save_v1', { p_kind: input.kind, p_item: input.item }) as Promise<Record<string, unknown>>,
      /** Indicadores internos por seção e período. (query; contract/staff/dashboard.v1.json) */
      dashboard: (input: { section?: "overview" | "acquisition" | "activation" | "engagement" | "retention" | "network" | "business" | "accounts"; from?: string; to?: string } = {}) => call('staff_dashboard_v1', { p_section: input.section, p_from: input.from, p_to: input.to }) as Promise<StaffDashboard>,
      /** Lê a proporção versionada entre seguidos e descoberta do feed. (query; contract/staff/feed_settings.v1.json) */
      feedSettings: () => call('staff_feed_settings_v1', {}) as Promise<StaffFeedSettings>,
      /** Atualiza a proporção do feed com concorrência otimista. (command; contract/staff/feed_settings_save.v1.json) */
      feedSettingsSave: (input: { followedSlots: number; discoverySlots: number; expectedVersion: number }) => call('staff_feed_settings_save_v1', { p_followed_slots: input.followedSlots, p_discovery_slots: input.discoverySlots, p_expected_version: input.expectedVersion }) as Promise<StaffFeedSettings>,
      /** Caixas e conversas administrativas. (query; contract/staff/mail.v1.json) */
      mail: (input: { mailbox?: string; search?: string; status?: string; cursor?: string; limit?: number } = {}) => call('staff_mail_v1', { p_mailbox: input.mailbox, p_search: input.search, p_status: input.status, p_cursor: input.cursor, p_limit: input.limit }) as Promise<StaffMail>,
      /** Enfileira envio, resposta ou encerra conversa. (command; contract/staff/mail_act.v1.json) */
      mailAct: (input: { id?: string; action: "send" | "reply" | "close"; data?: Record<string, unknown> }) => call('staff_mail_act_v1', { p_id: input.id, p_action: input.action, p_data: input.data }) as Promise<Record<string, unknown>>,
      /** Fila única de revisão e atendimento. (query; contract/staff/queue.v1.json) */
      queue: (input: { kind?: string; status?: string; cursor?: string; limit?: number } = {}) => call('staff_queue_v1', { p_kind: input.kind, p_status: input.status, p_cursor: input.cursor, p_limit: input.limit }) as Promise<StaffQueue>,
      /** Decide item com motivo tipado e auditoria. (command; contract/staff/queue_act.v1.json) */
      queueAct: (input: { id: string; action: "approve" | "reject" | "resolve" | "removeContent" | "markPaid"; reason: string }) => call('staff_queue_act_v1', { p_id: input.id, p_action: input.action, p_reason: input.reason }) as Promise<Record<string, unknown>>,
      /** Configurações internas versionadas. (query; contract/staff/settings.v1.json) */
      settings: (input: { subject?: string } = {}) => call('staff_settings_v1', { p_subject: input.subject }) as Promise<StaffSettings>,
      /** Salva configuração genérica com versão lida; configurações com contrato próprio usam sua operação tipada. (command; contract/staff/settings_save.v1.json) */
      settingsSave: (input: { subject: string; values: Record<string, unknown>; expectedVersion?: number }) => call('staff_settings_save_v1', { p_subject: input.subject, p_values: input.values, p_expected_version: input.expectedVersion }) as Promise<StaffSetting>,
    },
    help: {
      /** Abre pedido de ajuda na fila única. (command; contract/staff/help_request_save.v1.json) */
      requestSave: (input: { request: Record<string, unknown> }) => call('help_request_save_v1', { p_request: input.request }) as Promise<HelpRequest>,
    },
    training: {
      /** Importa um lote do Watch, Apple Saúde ou Health Connect. A execução iniciada no OnlyFit volta com o mesmo id e é enriquecida; repetir não duplica; a mesma execução regravada pela mesma origem vira observação; o vínculo é decidido por dia (J20.7). Lote vazio só reavalia os dias pendentes. (command; contract/training/activities_save.v1.json) */
      activitiesSave: (input: { activities: ImportedActivityInput[]; deleted?: DeletedActivityInput[] }) => call('training_activities_save_v1', { p_activities: input.activities, p_deleted: input.deleted }) as Promise<ActivitiesSaved>,
      /** Detalhe da atividade: provedor, tipo exato, métricas, rota, observações de cada origem, vínculo com confiança e os treinos do dia para corrigir. (query; contract/training/activity.v1.json) */
      activity: (input: { activityId: string }) => call('training_activity_v1', { p_activity_id: input.activityId }) as Promise<Activity>,
      /** Atividade manual, edição de importada (título, modalidade, métricas; o tipo exato recebido não muda e o antes vai para a auditoria), correção de vínculo (vira manual; se o treino escolhido já foi executado no app ou no Watch, a importada vira observação dessa execução, que é devolvida) ou exclusão. (command; contract/training/activity_save.v1.json) */
      activitySave: (input: { activity: ActivitySaveInput }) => call('training_activity_save_v1', { p_activity: input.activity }) as Promise<ActivitySaved>,
      /** Dias de um intervalo (até 62): treinos com estado, minutos de atividade e atividades importadas sem vínculo. (query; contract/training/calendar.v1.json) */
      calendar: (input: { from: string; to: string }) => call('training_calendar_v1', { p_from: input.from, p_to: input.to }) as Promise<CalendarDay[]>,
      /** Lê a semana e os ciclos de treino de um cliente com contrato e consentimento vigentes. (query; contract/training/client_plan.v1.json) */
      clientPlan: (input: { businessId: string; clientId: string; week?: string }) => call('training_client_plan_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_week: input.week }) as Promise<TrainingClientPlan>,
      /** Atribui, libera, oculta ou restaura a cópia independente do programa do cliente. (command; contract/training/client_program_act.v1.json) */
      clientProgramAct: (input: { businessId: string; clientId: string; programId: string | null; action: "assign" | "release" | "hide" | "restore"; sourceProgramId?: string | null; startDate?: string | null; idempotencyKey?: string | null }) => call('training_client_program_act_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_program_id: input.programId, p_action: input.action, p_source_program_id: input.sourceProgramId, p_start_date: input.startDate, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingClientProgramResult>,
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
      /** Salva atomicamente o modelo completo do programa de um negócio. (command; contract/training/program_save.v1.json) */
      programSave: (input: { program: TrainingProgramSaveInput }) => call('training_program_save_v1', { p_program: input.program }) as Promise<TrainingProgramModel>,
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
