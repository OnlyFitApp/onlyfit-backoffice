// GERADO por scripts/contract.mjs a partir de contract/. Não editar.
// Cada método chama uma fachada api.*_v1 ou uma rota Edge tipada do OnlyFit Core.

/** Executa a fachada `fn` (schema api) com os parâmetros nomeados. */
export type Transport = (fn: string, args: Record<string, unknown>) => Promise<unknown>;

/** Executa uma rota de um dos roteadores Edge canônicos. */
export type EdgeTransport = (fn: 'worker' | 'auth', path: string, body: Record<string, unknown>) => Promise<unknown>;

/** Valor que pode atravessar JSON sem coerção implícita. */
export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
export type JsonObject = { [key: string]: JsonValue };

/** Códigos de erro estáveis; o app traduz cada um para uma chave de i18n. */
export type ApiErrorCode =
  | 'app.invalid_location_filter'
  | 'auth.access_pending'
  | 'auth.invalid_token'
  | 'auth.required'
  | 'commerce.acceptances_required'
  | 'commerce.access_required'
  | 'commerce.ad_package_sold_out'
  | 'commerce.ad_package_unavailable'
  | 'commerce.advertising_not_configured'
  | 'commerce.app_store_account_mismatch'
  | 'commerce.app_store_not_configured'
  | 'commerce.app_store_transaction_invalid'
  | 'commerce.apple_fx_unavailable'
  | 'commerce.apple_storefront_unavailable'
  | 'commerce.buyer_incomplete'
  | 'commerce.card_command_busy'
  | 'commerce.card_not_found'
  | 'commerce.card_provider_failed'
  | 'commerce.card_setup_not_found'
  | 'commerce.card_state_failed'
  | 'commerce.charge_not_found'
  | 'commerce.club_not_found'
  | 'commerce.confirmed_purchase_required'
  | 'commerce.consultancy_action_required'
  | 'commerce.course_action_not_found'
  | 'commerce.course_asset_contract_mismatch'
  | 'commerce.course_asset_download_forbidden'
  | 'commerce.course_asset_not_found'
  | 'commerce.course_asset_unavailable'
  | 'commerce.course_asset_upload_conflict'
  | 'commerce.course_asset_upload_incomplete'
  | 'commerce.course_changed'
  | 'commerce.course_club_unavailable'
  | 'commerce.course_comment_not_found'
  | 'commerce.course_cover_not_found'
  | 'commerce.course_lesson_in_use'
  | 'commerce.course_not_found'
  | 'commerce.course_not_ready'
  | 'commerce.forbidden'
  | 'commerce.google_play_account_mismatch'
  | 'commerce.google_play_not_configured'
  | 'commerce.google_play_purchase_invalid'
  | 'commerce.google_play_purchase_not_found'
  | 'commerce.google_play_state_failed'
  | 'commerce.google_play_unavailable'
  | 'commerce.group_required'
  | 'commerce.idempotency_conflict'
  | 'commerce.idempotency_required'
  | 'commerce.insufficient_balance'
  | 'commerce.insufficient_stock'
  | 'commerce.invalid_ad_booking'
  | 'commerce.invalid_ad_filter'
  | 'commerce.invalid_apple_price'
  | 'commerce.invalid_card_command'
  | 'commerce.invalid_card_query'
  | 'commerce.invalid_channel'
  | 'commerce.invalid_charge_refund'
  | 'commerce.invalid_course'
  | 'commerce.invalid_course_action'
  | 'commerce.invalid_course_asset'
  | 'commerce.invalid_course_asset_state'
  | 'commerce.invalid_course_comment'
  | 'commerce.invalid_course_filter'
  | 'commerce.invalid_course_member_action'
  | 'commerce.invalid_course_offer'
  | 'commerce.invalid_course_state'
  | 'commerce.invalid_cursor'
  | 'commerce.invalid_google_play_purchase'
  | 'commerce.invalid_market_filter'
  | 'commerce.invalid_member_filter'
  | 'commerce.invalid_network_location'
  | 'commerce.invalid_network_principal'
  | 'commerce.invalid_offer'
  | 'commerce.invalid_offer_action'
  | 'commerce.invalid_offering_tool'
  | 'commerce.invalid_order_action'
  | 'commerce.invalid_order_filter'
  | 'commerce.invalid_payout'
  | 'commerce.invalid_physical_action'
  | 'commerce.invalid_physical_checkout'
  | 'commerce.invalid_physical_filter'
  | 'commerce.invalid_physical_media'
  | 'commerce.invalid_physical_product'
  | 'commerce.invalid_product'
  | 'commerce.invalid_progress'
  | 'commerce.invalid_purchase_filter'
  | 'commerce.invalid_purchase_payload'
  | 'commerce.invalid_return_url'
  | 'commerce.invalid_review'
  | 'commerce.invalid_review_report'
  | 'commerce.invalid_start_date'
  | 'commerce.invalid_storefront_cursor'
  | 'commerce.invalid_storefront_filter'
  | 'commerce.invalid_subscription_transition'
  | 'commerce.lesson_locked'
  | 'commerce.library_item_unavailable'
  | 'commerce.media_upload_conflict'
  | 'commerce.media_upload_contract_mismatch'
  | 'commerce.media_upload_incomplete'
  | 'commerce.native_product_mismatch'
  | 'commerce.native_product_unavailable'
  | 'commerce.native_transaction_mismatch'
  | 'commerce.network_closed'
  | 'commerce.network_manual_choice_disabled'
  | 'commerce.network_membership_exists'
  | 'commerce.offer_changed'
  | 'commerce.offer_delivery_changed'
  | 'commerce.offer_delivery_invalid'
  | 'commerce.offer_delivery_locked'
  | 'commerce.offer_delivery_not_found'
  | 'commerce.offer_delivery_required'
  | 'commerce.offer_delivery_unavailable'
  | 'commerce.offer_delivery_unsupported'
  | 'commerce.offer_limit_reached'
  | 'commerce.offer_locked'
  | 'commerce.offer_not_found'
  | 'commerce.offer_type_unavailable'
  | 'commerce.offer_unavailable'
  | 'commerce.offering_tool_changed'
  | 'commerce.offering_type_has_no_tools'
  | 'commerce.order_changed'
  | 'commerce.physical_media_not_found'
  | 'commerce.physical_product_changed'
  | 'commerce.physical_product_not_found'
  | 'commerce.price_required'
  | 'commerce.professional_required'
  | 'commerce.provider_action_failed'
  | 'commerce.provider_bind_failed'
  | 'commerce.provider_invalid_response'
  | 'commerce.provider_not_configured'
  | 'commerce.purchase_not_found'
  | 'commerce.purchase_not_pending'
  | 'commerce.quiz_invalid'
  | 'commerce.review_changed'
  | 'commerce.review_not_found'
  | 'commerce.storage_unavailable'
  | 'commerce.subscription_not_found'
  | 'health.answers_incomplete'
  | 'health.assistant_limit'
  | 'health.assistant_unavailable'
  | 'health.consent_policy_changed'
  | 'health.consent_required'
  | 'health.conversation_not_found'
  | 'health.document_not_ready'
  | 'health.event_not_found'
  | 'health.event_superseded'
  | 'health.file_in_use'
  | 'health.file_not_found'
  | 'health.file_unavailable'
  | 'health.forbidden'
  | 'health.form_changed'
  | 'health.form_not_found'
  | 'health.idempotency_required'
  | 'health.invalid_action'
  | 'health.invalid_answers'
  | 'health.invalid_assistant_action'
  | 'health.invalid_assistant_message'
  | 'health.invalid_consent'
  | 'health.invalid_correction'
  | 'health.invalid_document'
  | 'health.invalid_event'
  | 'health.invalid_media'
  | 'health.invalid_period'
  | 'health.invalid_progress_photo'
  | 'health.invalid_provider'
  | 'health.invalid_questionnaire'
  | 'health.invalid_report'
  | 'health.invalid_sync'
  | 'health.questionnaire_changed'
  | 'health.questionnaire_not_found'
  | 'health.report_changed'
  | 'health.report_not_found'
  | 'health.storage_unavailable'
  | 'health.upload_contract_mismatch'
  | 'health.upload_incomplete'
  | 'identity.account_not_found'
  | 'identity.auth_not_configured'
  | 'identity.delete_failed'
  | 'identity.document_in_use'
  | 'identity.email_already_confirmed'
  | 'identity.invalid_address'
  | 'identity.invalid_changes'
  | 'identity.invalid_credentials'
  | 'identity.invalid_device'
  | 'identity.invalid_document'
  | 'identity.invalid_email'
  | 'identity.invalid_full_name'
  | 'identity.invalid_password'
  | 'identity.invalid_preferences'
  | 'identity.invalid_signup_token'
  | 'identity.invalid_value'
  | 'identity.legal_required'
  | 'identity.legal_version_outdated'
  | 'identity.minimum_age'
  | 'identity.missing_credentials'
  | 'identity.onboarding_incomplete'
  | 'identity.one_default_address'
  | 'identity.paid_groups_active'
  | 'identity.preferences_conflict'
  | 'identity.professional_credential_invalid'
  | 'identity.professional_profile_required'
  | 'identity.professional_specialty_invalid'
  | 'identity.professional_vertical_required'
  | 'identity.recovery_rate_limited'
  | 'identity.resend_too_soon'
  | 'identity.signup_expired'
  | 'identity.signup_failed'
  | 'identity.signup_rate_limited'
  | 'identity.too_young'
  | 'identity.unknown_action'
  | 'identity.unknown_field'
  | 'identity.unknown_interest'
  | 'identity.unknown_level'
  | 'identity.unknown_pending_action'
  | 'identity.unknown_professional_vertical'
  | 'identity.username_invalid'
  | 'identity.username_taken'
  | 'interaction.comments_disabled'
  | 'interaction.forbidden'
  | 'interaction.invalid_action'
  | 'interaction.invalid_comment'
  | 'interaction.target_not_found'
  | 'internal.error'
  | 'media.audio_track_present'
  | 'media.cover_busy'
  | 'media.cover_expired'
  | 'media.cover_not_found'
  | 'media.cover_preparation_unavailable'
  | 'media.cover_selection_conflict'
  | 'media.cover_storage_unavailable'
  | 'media.file_too_large'
  | 'media.filename_required'
  | 'media.invalid_bucket'
  | 'media.invalid_completion'
  | 'media.invalid_cover_contract'
  | 'media.invalid_cover_dimensions'
  | 'media.invalid_cover_jpeg'
  | 'media.invalid_cover_size'
  | 'media.invalid_finalization'
  | 'media.invalid_upload'
  | 'media.invalid_upload_action'
  | 'media.invalid_video_contract'
  | 'media.invalid_video_size'
  | 'media.mime_not_allowed'
  | 'media.object_mismatch'
  | 'media.ogg_silent_attestation_unsupported'
  | 'media.processing'
  | 'media.quarantine_contract_mismatch'
  | 'media.rate_limited'
  | 'media.storage_unavailable'
  | 'media.story_forbidden'
  | 'media.story_not_found'
  | 'media.upload_already_completed'
  | 'media.upload_busy'
  | 'media.upload_expired'
  | 'media.upload_incomplete'
  | 'media.upload_not_found'
  | 'media.video_duration_exceeded'
  | 'media.video_duration_unverified'
  | 'media.video_requires_quarantine'
  | 'media.video_storage_unavailable'
  | 'nutrition.assistant_invalid_output'
  | 'nutrition.assistant_unavailable'
  | 'nutrition.diet_changed'
  | 'nutrition.diet_not_editable'
  | 'nutrition.diet_not_found'
  | 'nutrition.food_not_found'
  | 'nutrition.free_meal_not_found'
  | 'nutrition.idempotency_required'
  | 'nutrition.invalid_assistant_request'
  | 'nutrition.invalid_catalog_collection_filter'
  | 'nutrition.invalid_diet'
  | 'nutrition.invalid_diet_action'
  | 'nutrition.invalid_diet_state'
  | 'nutrition.invalid_food'
  | 'nutrition.invalid_free_meal'
  | 'nutrition.invalid_library_filter'
  | 'nutrition.invalid_meal'
  | 'nutrition.invalid_photo'
  | 'nutrition.invalid_range'
  | 'nutrition.meal_not_found'
  | 'nutrition.photo_in_use'
  | 'nutrition.photo_not_found'
  | 'nutrition.photo_unavailable'
  | 'nutrition.storage_unavailable'
  | 'nutrition.unknown_action'
  | 'nutrition.upload_conflict'
  | 'nutrition.upload_contract_mismatch'
  | 'nutrition.upload_incomplete'
  | 'nutrition.upload_rate_limited'
  | 'nutrition.version_conflict'
  | 'org.access_already_available'
  | 'org.access_changed'
  | 'org.access_not_found'
  | 'org.access_request_invalid'
  | 'org.already_member'
  | 'org.archive_requires_paused'
  | 'org.business_has_clients'
  | 'org.business_locked'
  | 'org.business_not_found'
  | 'org.cannot_hire_self'
  | 'org.care_task_changed'
  | 'org.care_task_forbidden'
  | 'org.care_task_not_found'
  | 'org.client_forbidden'
  | 'org.client_not_found'
  | 'org.client_scope_required'
  | 'org.company_document_in_use'
  | 'org.company_fields_required'
  | 'org.consent_item_not_requested'
  | 'org.consent_must_cover_declared_scope'
  | 'org.consent_owner_required'
  | 'org.consultancy_required'
  | 'org.contract_already_ended'
  | 'org.contract_changed'
  | 'org.contract_end_reason_required'
  | 'org.contract_ended'
  | 'org.contract_not_found'
  | 'org.contract_party_required'
  | 'org.document_required'
  | 'org.forbidden'
  | 'org.idempotency_conflict'
  | 'org.idempotency_required'
  | 'org.invalid_access_level'
  | 'org.invalid_action'
  | 'org.invalid_business'
  | 'org.invalid_care_task'
  | 'org.invalid_care_task_filter'
  | 'org.invalid_care_task_status'
  | 'org.invalid_commercial_profile'
  | 'org.invalid_company_document'
  | 'org.invalid_consent_action'
  | 'org.invalid_consent_transition'
  | 'org.invalid_crm_cursor'
  | 'org.invalid_crm_filter'
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
  | 'platform.idempotency_conflict'
  | 'platform.invalid_events'
  | 'platform.maintenance'
  | 'platform.maintenance_state_unavailable'
  | 'platform.mark_window_closed'
  | 'platform.reason_note_required'
  | 'platform.reason_required'
  | 'request.invalid_json'
  | 'social.access_immutable'
  | 'social.access_required'
  | 'social.adult_required'
  | 'social.attachment_immutable'
  | 'social.blocked'
  | 'social.challenge_closed'
  | 'social.challenge_full'
  | 'social.checkin_duplicate'
  | 'social.checkin_photo_required'
  | 'social.checkin_required'
  | 'social.club_community_exists'
  | 'social.club_required'
  | 'social.container_inactive'
  | 'social.container_read_only'
  | 'social.contest_closed'
  | 'social.contest_open'
  | 'social.event_closed'
  | 'social.event_not_started'
  | 'social.forbidden'
  | 'social.group_not_found'
  | 'social.idempotency_required'
  | 'social.invalid_account_ids'
  | 'social.invalid_action'
  | 'social.invalid_activity'
  | 'social.invalid_affinity'
  | 'social.invalid_attachment'
  | 'social.invalid_challenge'
  | 'social.invalid_checkin'
  | 'social.invalid_classification'
  | 'social.invalid_community'
  | 'social.invalid_composition'
  | 'social.invalid_container'
  | 'social.invalid_contest'
  | 'social.invalid_cover'
  | 'social.invalid_cursor'
  | 'social.invalid_event'
  | 'social.invalid_group'
  | 'social.invalid_hosted_challenge'
  | 'social.invalid_media'
  | 'social.invalid_member'
  | 'social.invalid_message'
  | 'social.invalid_message_media'
  | 'social.invalid_message_media_state'
  | 'social.invalid_offer'
  | 'social.invalid_poll'
  | 'social.invalid_poll_option'
  | 'social.invalid_post'
  | 'social.invalid_posts'
  | 'social.invalid_relation'
  | 'social.invalid_report'
  | 'social.invalid_resource'
  | 'social.invalid_resource_state'
  | 'social.invalid_scope'
  | 'social.invalid_search'
  | 'social.invalid_showcase'
  | 'social.invalid_space'
  | 'social.invalid_sport'
  | 'social.invalid_state'
  | 'social.invalid_story'
  | 'social.invalid_tab'
  | 'social.invalid_tag'
  | 'social.media_not_owned'
  | 'social.media_not_ready'
  | 'social.message_media_contract_mismatch'
  | 'social.message_media_not_found'
  | 'social.message_media_unavailable'
  | 'social.message_media_upload_conflict'
  | 'social.message_media_upload_expired'
  | 'social.message_media_upload_incomplete'
  | 'social.message_not_found'
  | 'social.message_rate_limit'
  | 'social.paid_offer_required'
  | 'social.platform_membership_required'
  | 'social.points_rules_required'
  | 'social.poll_closed'
  | 'social.poll_locked'
  | 'social.post_not_found'
  | 'social.prize_terms_required'
  | 'social.professional_required'
  | 'social.profile_not_found'
  | 'social.report_target_not_found'
  | 'social.resource_contract_mismatch'
  | 'social.resource_not_found'
  | 'social.resource_not_ready'
  | 'social.resource_unavailable'
  | 'social.resource_upload_conflict'
  | 'social.resource_upload_incomplete'
  | 'social.rules_immutable'
  | 'social.storage_unavailable'
  | 'social.story_expired'
  | 'social.story_too_long'
  | 'social.version_conflict'
  | 'social.video_total_exceeded'
  | 'staff.account_email_not_found'
  | 'staff.account_not_found'
  | 'staff.app_store_catalog_changed'
  | 'staff.app_store_catalog_incomplete'
  | 'staff.app_store_finance_not_configured'
  | 'staff.app_store_product_not_approved'
  | 'staff.app_store_review_contract_mismatch'
  | 'staff.app_store_review_storage_unavailable'
  | 'staff.app_store_review_upload_conflict'
  | 'staff.app_store_review_upload_incomplete'
  | 'staff.app_store_review_upload_not_found'
  | 'staff.beta_feedback_changed'
  | 'staff.beta_feedback_not_found'
  | 'staff.beta_feedback_screenshot_not_found'
  | 'staff.beta_feedback_status_invalid'
  | 'staff.beta_feedback_storage_unavailable'
  | 'staff.beta_feedback_update_invalid'
  | 'staff.business_not_found'
  | 'staff.business_verification_changed'
  | 'staff.catalog_changed'
  | 'staff.catalog_confirmation_required'
  | 'staff.catalog_in_use'
  | 'staff.catalog_item_not_found'
  | 'staff.catalog_name_taken'
  | 'staff.channel_cost_period_overlap'
  | 'staff.channel_cost_policy_changed'
  | 'staff.channel_cost_policy_not_activatable'
  | 'staff.channel_cost_policy_not_found'
  | 'staff.channel_cost_policy_not_publishable'
  | 'staff.channel_cost_policy_not_retirable'
  | 'staff.community_not_found'
  | 'staff.community_state_changed'
  | 'staff.compensation_matrix_changed'
  | 'staff.compensation_matrix_incomplete'
  | 'staff.compensation_matrix_not_activatable'
  | 'staff.compensation_matrix_not_found'
  | 'staff.compensation_matrix_not_retirable'
  | 'staff.compensation_period_overlap'
  | 'staff.compensation_policy_not_found'
  | 'staff.course_comment_report_changed'
  | 'staff.course_comment_report_not_found'
  | 'staff.credential_reset_failed'
  | 'staff.dispute_not_found'
  | 'staff.dispute_state_changed'
  | 'staff.email_attachment_not_found'
  | 'staff.email_attachment_unavailable'
  | 'staff.email_box_invalid'
  | 'staff.email_mailbox_not_found'
  | 'staff.email_not_configured'
  | 'staff.email_provider_unavailable'
  | 'staff.email_reply_not_found'
  | 'staff.email_send_in_progress'
  | 'staff.email_send_invalid'
  | 'staff.email_send_rate_limited'
  | 'staff.email_storage_unavailable'
  | 'staff.email_sync_rate_limited'
  | 'staff.email_thread_not_found'
  | 'staff.exercise_changed'
  | 'staff.exercise_media_contract_mismatch'
  | 'staff.exercise_media_not_found'
  | 'staff.exercise_media_upload_conflict'
  | 'staff.exercise_media_upload_incomplete'
  | 'staff.exercise_not_found'
  | 'staff.financial_offering_not_ready'
  | 'staff.first_contact_alert_before_reminder'
  | 'staff.first_contact_settings_changed'
  | 'staff.forbidden'
  | 'staff.health_library_changed'
  | 'staff.health_library_item_not_found'
  | 'staff.idempotency_required'
  | 'staff.invalid_action'
  | 'staff.invalid_affinity_group'
  | 'staff.invalid_app_store_catalog_action'
  | 'staff.invalid_app_store_catalog_filter'
  | 'staff.invalid_app_store_metadata'
  | 'staff.invalid_app_store_reconciliation_period'
  | 'staff.invalid_app_store_review_image'
  | 'staff.invalid_app_store_transaction_filter'
  | 'staff.invalid_business_niche'
  | 'staff.invalid_business_verification_action'
  | 'staff.invalid_business_verification_filter'
  | 'staff.invalid_catalog'
  | 'staff.invalid_catalog_action'
  | 'staff.invalid_catalog_item'
  | 'staff.invalid_catalog_key'
  | 'staff.invalid_channel_cost_command'
  | 'staff.invalid_channel_cost_filter'
  | 'staff.invalid_community_action'
  | 'staff.invalid_community_filter'
  | 'staff.invalid_compensation_command'
  | 'staff.invalid_compensation_filter'
  | 'staff.invalid_compensation_scenario'
  | 'staff.invalid_compensation_simulation'
  | 'staff.invalid_course_comment_report_action'
  | 'staff.invalid_course_comment_report_filter'
  | 'staff.invalid_credential_action'
  | 'staff.invalid_credential_reset'
  | 'staff.invalid_credential_status'
  | 'staff.invalid_cursor'
  | 'staff.invalid_dashboard'
  | 'staff.invalid_dispute_action'
  | 'staff.invalid_dispute_filter'
  | 'staff.invalid_exercise'
  | 'staff.invalid_exercise_action'
  | 'staff.invalid_exercise_filter'
  | 'staff.invalid_exercise_media'
  | 'staff.invalid_feed_settings'
  | 'staff.invalid_fight_technique'
  | 'staff.invalid_filter'
  | 'staff.invalid_financial_offering_filter'
  | 'staff.invalid_financial_report_period'
  | 'staff.invalid_first_contact_deadlines'
  | 'staff.invalid_health_library_action'
  | 'staff.invalid_health_library_filter'
  | 'staff.invalid_health_library_item'
  | 'staff.invalid_market_store'
  | 'staff.invalid_market_store_query'
  | 'staff.invalid_member_access_action'
  | 'staff.invalid_member_access_filter'
  | 'staff.invalid_member_area_audit_filter'
  | 'staff.invalid_native_product'
  | 'staff.invalid_network_action'
  | 'staff.invalid_network_data'
  | 'staff.invalid_network_principal'
  | 'staff.invalid_network_status'
  | 'staff.invalid_network_transition'
  | 'staff.invalid_payment_settings'
  | 'staff.invalid_payment_transaction_filter'
  | 'staff.invalid_payout_action'
  | 'staff.invalid_payout_batch'
  | 'staff.invalid_payout_filter'
  | 'staff.invalid_payout_proof'
  | 'staff.invalid_payout_reason'
  | 'staff.invalid_payout_transition'
  | 'staff.invalid_period'
  | 'staff.invalid_product_category'
  | 'staff.invalid_professional_specialty'
  | 'staff.invalid_protocol_step'
  | 'staff.invalid_protocol_step_translation'
  | 'staff.invalid_protocol_template'
  | 'staff.invalid_protocol_translation'
  | 'staff.invalid_reconciliation_filter'
  | 'staff.invalid_reconciliation_period'
  | 'staff.invalid_review_report_action'
  | 'staff.invalid_review_report_filter'
  | 'staff.invalid_role'
  | 'staff.invalid_search'
  | 'staff.invalid_session_type'
  | 'staff.invalid_sport'
  | 'staff.invalid_training_quota'
  | 'staff.invalid_treasury_movement'
  | 'staff.invite_email_count_invalid'
  | 'staff.invite_email_invalid'
  | 'staff.invite_note_too_long'
  | 'staff.invite_settings_changed'
  | 'staff.invite_settings_missing'
  | 'staff.invite_waitlist_entry_not_found'
  | 'staff.invite_waitlist_status_invalid'
  | 'staff.last_catalog_item'
  | 'staff.last_super_admin'
  | 'staff.legal_document_changed'
  | 'staff.legal_document_invalid'
  | 'staff.legal_document_not_found'
  | 'staff.legal_journey_invalid'
  | 'staff.legal_pdf_invalid'
  | 'staff.legal_storage_unavailable'
  | 'staff.legal_upload_contract_mismatch'
  | 'staff.legal_upload_not_found'
  | 'staff.legal_version_exists'
  | 'staff.market_store_business_taken'
  | 'staff.market_store_changed'
  | 'staff.member_access_changed'
  | 'staff.member_access_not_found'
  | 'staff.mfa_required'
  | 'staff.native_product_changed'
  | 'staff.native_product_conflict'
  | 'staff.network_assignment_not_found'
  | 'staff.network_changed'
  | 'staff.network_conflict'
  | 'staff.network_policy_not_found'
  | 'staff.network_region_in_use'
  | 'staff.network_region_not_found'
  | 'staff.network_request_not_found'
  | 'staff.network_scope_inactive'
  | 'staff.network_setting_not_found'
  | 'staff.payout_changed'
  | 'staff.payout_not_found'
  | 'staff.payout_proof_contract_mismatch'
  | 'staff.payout_proof_not_found'
  | 'staff.payout_proof_storage_unavailable'
  | 'staff.payout_proof_upload_conflict'
  | 'staff.payout_proof_upload_incomplete'
  | 'staff.queue_item_not_found'
  | 'staff.queue_item_stale'
  | 'staff.reconciliation_not_found'
  | 'staff.reconciliation_provider_unavailable'
  | 'staff.review_report_changed'
  | 'staff.review_report_not_found'
  | 'staff.role_conflict'
  | 'staff.settings_changed'
  | 'staff.training_quota_changed'
  | 'training.activity_not_found'
  | 'training.already_started'
  | 'training.assignment_not_found'
  | 'training.assignment_slot_taken'
  | 'training.cannot_delete_session'
  | 'training.cannot_edit_session'
  | 'training.exercise_not_found'
  | 'training.future_workout'
  | 'training.idempotency_required'
  | 'training.invalid_activities'
  | 'training.invalid_activity'
  | 'training.invalid_actual'
  | 'training.invalid_alias'
  | 'training.invalid_assignment'
  | 'training.invalid_client_history_range'
  | 'training.invalid_consumption'
  | 'training.invalid_dates'
  | 'training.invalid_exercise'
  | 'training.invalid_exercise_media'
  | 'training.invalid_exercise_state'
  | 'training.invalid_link'
  | 'training.invalid_mark'
  | 'training.invalid_occurrence_edit'
  | 'training.invalid_prescription'
  | 'training.invalid_program'
  | 'training.invalid_program_state'
  | 'training.invalid_protocol'
  | 'training.invalid_protocol_source'
  | 'training.invalid_protocol_state'
  | 'training.invalid_protocol_steps'
  | 'training.invalid_protocol_template'
  | 'training.invalid_range'
  | 'training.invalid_review'
  | 'training.invalid_routine'
  | 'training.invalid_scope'
  | 'training.invalid_sport'
  | 'training.invalid_start_date'
  | 'training.invalid_steps'
  | 'training.invalid_workout'
  | 'training.invalid_zones'
  | 'training.library_full'
  | 'training.not_assigned'
  | 'training.professional_credential_required'
  | 'training.program_already_active'
  | 'training.program_not_found'
  | 'training.protocol_not_found'
  | 'training.protocol_template_not_found'
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
  | 'training.version_conflict'
  | 'training.workout_not_editable'
  | 'training.workout_not_found'
  | 'training.zones_changed';

export interface AcceptedLegalDocument {
  key: string;
  version: string;
  kind: "acceptance" | "notice" | "declaration";
  title: string;
  url: string;
  required: boolean;
  accepted_at: string | null;
}

export interface AccountCard {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
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
  /** Mapa dinâmico de métricas numéricas nomeadas pelo catálogo. */
  metrics: Record<string, number>;
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
  /** Desafios em que a atividade contou e com quanto (J16/J20). */
  counted_in: ActivityCountedIn[];
}

export interface ActivityCountedIn {
  challenge_id: string;
  name: string;
  metric: "active_days" | "streak" | "activities" | "calories" | "distance" | "minutes" | "points";
  amount: number;
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
  /** Mapa dinâmico de métricas numéricas nomeadas pelo catálogo. */
  metrics: Record<string, number>;
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
  /** Mapa dinâmico de métricas numéricas nomeadas pelo catálogo. */
  metrics: Record<string, number>;
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
  metrics?: Record<string, number>;
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
  label: string;
  aliases: string[];
  icon: string;
  accent: string;
}

export interface AppLocation {
  id: number;
  country_code: "BR";
  state_code: string;
  state_name: string;
  city_name: string;
}

export interface AppLocationPage {
  items: AppLocation[];
  limit: number;
}

export type AppTelemetryAttributes = Record<string, string | number | boolean | null>;

export interface AppTelemetryEvent {
  id: string;
  name: string;
  at: string;
  target_type?: string | null;
  target_id?: string | null;
  props: AppTelemetryAttributes;
}

export interface AssignedWorkout {
  id: string;
  title: string;
  sport_id: string | null;
  steps: number;
  version: number;
  updated_at: string;
  professional: AccountCard | null;
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

export interface CalendarActivity {
  id: string;
  source: "app" | "watch" | "health" | "manual";
  provider: string | null;
  activity_type: string | null;
  sport_id: string | null;
  title: string | null;
  started_at: string | null;
  ended_at: string | null;
  origin: ActivityOrigin;
  source_name: string | null;
  device_name: string | null;
  duration_seconds: number | null;
  distance_meters: number | null;
  calories: number | null;
  average_heart_rate: number | null;
  minimum_heart_rate: number | null;
  maximum_heart_rate: number | null;
  elevation_meters: number | null;
  rpe: number | null;
  scheduled_id: string | null;
  scheduled_date: string | null;
  link_method: string | null;
  link_confidence: number | null;
  workout_title: string | null;
}

export interface CalendarDay {
  date: string;
  items: CalendarItem[];
  /** Minutos de atividade real no dia (J16.58); execução vinculada conta uma vez. */
  minutes: number;
  /** Execuções concluídas sem ocorrência visível e atividades importadas ou manuais do dia, incluindo seus vínculos canônicos com o treino. */
  activities: CalendarActivity[];
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
  challenge_templates: ChallengeTemplate[];
  affinity_groups: AffinityGroup[];
  sports: Sport[];
  session_types: SessionType[];
  /** Motivos de 'não fiz' (J16.22); 'other' exige texto. */
  not_done_reasons: NotDoneReason[];
  /** Níveis do onboarding (J01.2). */
  fitness_levels: FitnessLevel[];
  /** Nichos válidos para cadastro de empresa. */
  business_niches: BusinessNiche[];
  /** Categorias configuráveis dos produtos físicos do Mercado. */
  product_categories: ProductCategory[];
  /** Modelos de protocolo mantidos pela staff; desativar não quebra protocolos já aplicados. */
  protocol_templates: ProtocolTemplate[];
  /** Tipos de oferta configurados pela staff; capacidade de entrega é validada no servidor. */
  offer_types: OfferType[];
  /** Canais de pagamento habilitados pela staff. */
  payment_channels: PaymentChannel[];
  food_sources: FoodSource[];
  nutrients: NutrientCatalogItem[];
  /** Especialidades profissionais configuradas pela staff; o conselho pertence ao catálogo. */
  professional_specialties: ProfessionalSpecialty[];
}

export interface CatalogsResponse {
  version: string;
  changed: boolean;
  catalogs: Catalogs | null;
}

export interface ChallengeTemplate {
  id: string;
  name_key: string;
  metric: "active_days" | "streak" | "activities" | "calories" | "distance" | "minutes" | "steps" | "points";
  duration_days: number;
  access_mode: "open" | "approval" | "invite";
  icon: string;
  target: number | null;
}

export interface CombatPrescription {
  engine: "combat";
  discipline: "boxing" | "muay_thai" | "mma" | "bjj" | "judo" | "karate" | "generic";
  rounds: CombatRound[];
}

export interface CombatRound {
  kind: "technique" | "drill" | "sparring" | "conditioning";
  duration_s: number;
  rest_s: number;
  effort_rpe?: number;
  repeat?: number;
  technique_id?: string;
  technique_name?: string;
  technique_video_url?: string;
  notes?: string;
}

export interface CommerceAcceptance {
  key: string;
  version: string;
}

export interface CommerceAdBooking {
  id: string;
  business_id: string;
  package: CommerceAdBookingPackage;
  purchase_id: string | null;
  checkout_status: "pending" | "confirmed" | "failed" | "cancelled" | "refunded" | null;
  status: "reserved" | "pending_payment" | "active" | "expired" | "failed" | "cancelled" | "refunded";
  reserved_until: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface CommerceAdBookingPackage {
  id: string;
  placement: "sponsor_carousel" | "featured_products";
  offer_id: string;
  duration_days: number;
  capacity: number;
  position: number;
  price: number;
  currency: string;
  name: string;
}

export interface CommerceAdBookingPage {
  items: CommerceAdBooking[];
  total: number;
  limit: number;
  offset: number;
}

export interface CommerceAdPackage {
  id: string;
  placement: "sponsor_carousel" | "featured_products";
  offer_id: string;
  name: string;
  duration_days: number;
  capacity: number;
  available_slots: number;
  price: number;
  currency: string;
  position: number;
  version: number;
}

export interface CommerceAdPackages {
  business_id: string;
  items: CommerceAdPackage[];
}

export interface CommerceAmbassadorContext {
  enabled: boolean;
  allow_direct: boolean;
  vertical: CommerceAmbassadorVertical;
  location: CommerceAmbassadorLocation;
  membership: CommerceAmbassadorMembershipView | null;
  principals: CommerceAmbassadorPrincipal[];
}

export interface CommerceAmbassadorLocation {
  country_code: string;
  state_code: string | null;
  city_name: string | null;
}

export interface CommerceAmbassadorMembership {
  id: string;
  status: string;
  classification: string;
  container_id: string;
  principal_membership_id: string | null;
}

export interface CommerceAmbassadorMembershipView {
  id: string;
  status: string;
  classification: string;
  container_id: string;
  principal_membership_id: string | null;
}

export interface CommerceAmbassadorPrincipal {
  membership_id: string;
  classification: "ambassador" | "associate";
  badge_label: string;
  profile: CommerceProfessionalCard;
}

export interface CommerceAmbassadorVertical {
  key: string;
  label: string;
}

export interface CommerceAppStoreVerification {
  ok: boolean;
  has_access: boolean;
  purchase_id: string;
  transaction_id: string;
  status: "confirmed" | "refunded";
}

export interface CommerceAppleAdvancedCheckout {
  product_id: string;
  sku: string;
  app_account_token: string;
  request_reference_id: string;
  storefront: string;
  currency: string;
  price_milliunits: number;
  data: CommerceAppleAdvancedCommerceData;
}

export interface CommerceAppleAdvancedCommerceData {
  signatureInfo: CommerceAppleAdvancedSignatureInfo;
}

export interface CommerceAppleAdvancedSignatureInfo {
  token: string;
}

export interface CommerceAppleStorefrontCapability {
  storefront: "BRA" | "PRT";
  currency: "BRL" | "EUR";
}

export interface CommerceAppleStorefrontPrice {
  storefront: "BRA" | "PRT";
  price_mode: "automatic" | "manual";
  /** Preço manual em unidades monetárias. Automático exige null; moeda e conversão são resolvidas pelo Core. */
  price: number | null;
  display_name?: string;
  description?: string;
  subscription_display_name?: string;
  subscription_description?: string;
}

export interface CommerceBusinessCard {
  id: string;
  name: string;
  logo_url: string;
  verified: boolean;
  official: boolean;
}

export type CommerceCardAction = CommerceCardRemoved | CommerceCardDefaulted | CommerceCardRenamed;

export type CommerceCardCommand = CommerceCardRemoveCommand | CommerceCardDefaultCommand | CommerceCardRenameCommand;

export interface CommerceCardDefaultCommand {
  action: "set_default";
  payment_method_reference: string;
  idempotency_key: string;
}

export interface CommerceCardDefaulted {
  action: "set_default";
  status: "updated";
  payment_method_reference: string;
  nickname: null;
  is_default: true;
}

export interface CommerceCardRemoveCommand {
  action: "remove";
  payment_method_reference: string;
  idempotency_key: string;
}

export interface CommerceCardRemoved {
  action: "remove";
  status: "removed";
  payment_method_reference: string;
  nickname: null;
  is_default: null;
}

export interface CommerceCardRenameCommand {
  action: "rename";
  payment_method_reference: string;
  nickname: string | null;
  idempotency_key: string;
}

export interface CommerceCardRenamed {
  action: "rename";
  status: "updated";
  payment_method_reference: string;
  nickname: string | null;
  is_default: null;
}

export interface CommerceCardSetup {
  setup_intent_reference: string;
  client_secret: string;
  publishable_key: string;
}

export interface CommerceCharge {
  id: string;
  kind: "charge" | "refund" | "dispute" | "reversal";
  status: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  occurred_at: string;
}

export interface CommerceChargeRefundResult {
  action_id: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  charge_id: string;
  refund_charge_id?: string | null;
}

export interface CommerceCheckoutResult {
  purchase_id: string;
  offer_id: string;
  status: "pending" | "confirmed" | "failed" | "cancelled" | "refunded";
  channel: "free" | "app_store" | "google_play" | "stripe_card" | "asaas_pix";
  amount: number;
  currency: string;
  offer_name: string;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: string | null;
  provider_reference: string | null;
  contract_id: string | null;
  confirmed_at: string | null;
  created_at: string;
  payment_kind: "free" | "native_store" | "stripe_elements" | "asaas_pix";
  payment_channel: string | null;
  client_secret: string | null;
  publishable_key: string | null;
  return_url: string | null;
  payment_reference: string | null;
  pix_payload: string | null;
  pix_qr_code_base64: string | null;
  invoice_url: string | null;
  expires_at: string | null;
  apple_advanced_commerce: CommerceAppleAdvancedCheckout | null;
}

export interface CommerceClub {
  offer: CommerceClubOffer;
  professional: SocialProfileReadCard;
  exclusive_post_count: number;
  exclusive_story_count: number;
  community: CommerceClubCommunity | null;
  community_enabled: boolean;
  benefits: string[];
  access: CommerceClubAccess;
  courses: CommerceClubCourse[];
}

export interface CommerceClubAccess {
  state: "none" | "active" | "past_due" | "owner";
  valid_until: string | null;
}

export interface CommerceClubCommunity {
  id: string;
  name: string;
  image_url: string | null;
  members: number;
}

export interface CommerceClubCourse {
  course_id: string;
  title: string;
  content_kind: "course" | "video" | "pdf" | "article";
  lesson_count: number;
}

export interface CommerceClubOffer {
  id: string;
  name: string;
  description: string;
  price: number | null;
  currency: string;
  billing_interval: string | null;
  status: "draft" | "ready" | "published" | "paused" | "archived";
}

export interface CommerceCourse {
  id: string;
  offer_id: string | null;
  business_id: string;
  title: string;
  description: string | null;
  content_kind: "course" | "video" | "pdf" | "article";
  comments_enabled: boolean;
  cover_file_id: string | null;
  settings: CommerceCourseSettings;
  organization: CommerceBusinessCard;
  presenter: CommerceCoursePresenter;
  status: "draft" | "published" | "archived";
  modules: CommerceCourseModule[];
  version: number;
  updated_at: string;
}

export interface CommerceCourseAction {
  id: string;
  action_type: "workout" | "program" | "diet" | "exercise" | "protocol" | "challenge" | "community";
  reference_id: string;
  title: string;
  course_id: string;
  lesson_id: string;
  organization: CommerceBusinessCard;
  resource: CommerceCourseActionResource;
  target_id: string | null;
}

export type CommerceCourseActionResource = CommerceCourseExerciseResource | CommerceCourseWorkoutResource | CommerceCourseProgramResource | CommerceCourseDietResource | CommerceCourseProtocolResource | CommerceCourseChallengeResource | CommerceCourseCommunityResource;

export interface CommerceCourseAsset {
  url: string;
  expires_in: number;
  format: "hls" | "file";
  transcript: CommerceTranscriptCue[] | null;
}

export interface CommerceCourseAssetComplete {
  action: "complete";
  request_id: string;
  course_id: string;
  idempotency_key: string;
}

export interface CommerceCourseAssetPending {
  file_id: string;
  status: "pending";
  upload_url: string;
  upload_headers: CommerceCourseAssetUploadHeaders;
  expires_in: number;
}

export interface CommerceCourseAssetPrepare {
  action: "prepare";
  request_id: string;
  course_id: string;
  filename: string;
  mime: "video/mp4" | "video/webm" | "audio/mpeg" | "audio/mp4" | "application/pdf" | "image/jpeg" | "image/png" | "image/webp";
  bytes: number;
}

export interface CommerceCourseAssetReady {
  file_id: string;
  status: "ready";
  mime: string;
  bytes: number;
}

export type CommerceCourseAssetUpload = CommerceCourseAssetPending | CommerceCourseAssetReady;

export interface CommerceCourseAssetUploadHeaders {
  "Content-Type": string;
  "Content-Length": string;
}

export type CommerceCourseAssetUploadInput = CommerceCourseAssetPrepare | CommerceCourseAssetComplete;

export interface CommerceCourseChallengeResource {
  kind: "challenge";
  id: string;
  name: string;
  image_url: string | null;
  access_mode: string;
  starts_at: string | null;
  ends_at: string | null;
  members: number;
}

export interface CommerceCourseComment {
  id: string;
  parent_id: string | null;
  author_name: string;
  author_avatar: string | null;
  body: string;
  created_at: string;
  mine: boolean;
  can_moderate: boolean;
}

export interface CommerceCourseCommentAction {
  status: string;
  comment?: CommerceCourseComment;
}

export interface CommerceCourseComments {
  items: CommerceCourseComment[];
}

export interface CommerceCourseCommunityResource {
  kind: "community";
  id: string;
  name: string;
  image_url: string | null;
  access_mode: string;
  starts_at: string | null;
  ends_at: string | null;
  members: number;
}

export interface CommerceCourseDietResource {
  kind: "diet";
  id: string;
  title: string;
  objective: string | null;
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  meal_count: number;
}

export interface CommerceCourseEmbeddedAction {
  id: string;
  action_type: "workout" | "program" | "diet" | "exercise" | "protocol" | "challenge" | "community";
  reference_id: string;
  title: string;
  position: number;
}

export interface CommerceCourseExerciseResource {
  kind: "exercise";
  id: string;
  name: string;
  video_url: string | null;
  thumb_url: string | null;
}

export interface CommerceCourseInput {
  title: string;
  description: string | null;
  content_kind: "course" | "video" | "pdf" | "article";
  comments_enabled: boolean;
  cover_file_id: string | null;
  settings: CommerceCourseInputSettings;
  modules: CommerceCourseModule[];
}

export interface CommerceCourseInputSettings {
  sequential_access: boolean;
  club_included: boolean;
}

export interface CommerceCourseInsights {
  learners: number;
  completed: number;
  lessons: CommerceCourseLessonInsight[];
}

export interface CommerceCourseLesson {
  id: string;
  title: string;
  summary: string | null;
  lesson_type: "mixed" | "text" | "video" | "audio" | "document";
  position: number;
  body: string | null;
  duration_seconds: number | null;
  is_preview: boolean;
  available_after_days: number;
  prerequisite_lesson_id: string | null;
  thumbnail_file_id: string | null;
  comments_enabled: boolean | null;
  is_required: boolean;
  archived: boolean;
  assets: CommerceCourseLessonAsset[];
  actions: CommerceCourseEmbeddedAction[];
  quiz: CommerceCourseQuiz | null;
  transcript_enabled: boolean;
}

export interface CommerceCourseLessonAsset {
  id: string;
  asset_type: "video" | "audio" | "pdf" | "image" | "link" | "file";
  title: string;
  file_id: string | null;
  external_url: string | null;
  file_name: string | null;
  mime_type: string | null;
  downloadable: boolean;
  position: number;
  is_required: boolean;
  duration_seconds: number | null;
  component_total_pages: number | null;
}

export interface CommerceCourseLessonInsight {
  lesson_id: string;
  started: number;
  completed: number;
  quiz_attempts: number;
  quiz_average_percent: number | null;
}

export interface CommerceCourseLessonLock {
  reason: "purchase" | "scheduled" | "prerequisite" | "sequence";
  available_at: string | null;
  prerequisite_lesson_id: string | null;
}

export interface CommerceCourseMemberAccess {
  source: "purchase" | "club" | "professional" | "preview";
  started_at: string | null;
  expires_at: string | null;
}

export interface CommerceCourseMemberActInput {
  lesson_id: string;
  action_id?: string;
  start_date?: string | null;
  activate?: boolean;
  answers?: Record<string, string>;
  idempotency_key?: string;
}

export interface CommerceCourseMemberAction {
  id: string;
  action_type: "workout" | "program" | "diet" | "exercise" | "protocol" | "challenge" | "community";
  reference_id: string;
  title: string;
  target_id: string | null;
}

export interface CommerceCourseMemberAsset {
  id: string;
  asset_type: "video" | "audio" | "pdf" | "image" | "link" | "file";
  title: string;
  external_url: string | null;
  file_name: string | null;
  mime_type: string | null;
  downloadable: boolean;
  is_required: boolean;
  duration_seconds: number | null;
  component_total_pages: number | null;
  progress: CommerceCourseMemberAssetProgress;
}

export interface CommerceCourseMemberAssetProgress {
  ratio: number;
  position_seconds: number | null;
  page: number | null;
  total_pages: number | null;
}

export interface CommerceCourseMemberLesson {
  id: string;
  title: string;
  summary: string | null;
  lesson_type: "mixed" | "text" | "video" | "audio" | "document";
  duration_seconds: number | null;
  is_preview: boolean;
  is_required: boolean;
  comments_enabled: boolean;
  thumbnail_url: string | null;
  transcript_enabled: boolean;
  status: "not_started" | "in_progress" | "completed";
  position_seconds: number;
  body_ratio: number;
  lock: CommerceCourseLessonLock | null;
  body: string | null;
  assets: CommerceCourseMemberAsset[];
  actions: CommerceCourseMemberAction[];
  quiz: CommerceCourseMemberQuiz | null;
}

export interface CommerceCourseMemberModule {
  id: string;
  title: string;
  description: string | null;
  lessons: CommerceCourseMemberLesson[];
}

export interface CommerceCourseMemberProgress {
  percent: number;
  completed_lessons: number;
  total_lessons: number;
  last_lesson_id: string | null;
  last_position_seconds: number;
  last_opened_at: string | null;
}

export interface CommerceCourseMemberQuiz {
  required: boolean;
  pass_percent: number;
  questions: CommerceCourseMemberQuizQuestion[];
  result: CommerceCourseQuizResult | null;
}

export interface CommerceCourseMemberQuizOption {
  id: string;
  text: string;
}

export interface CommerceCourseMemberQuizQuestion {
  id: string;
  prompt: string;
  options: CommerceCourseMemberQuizOption[];
}

export interface CommerceCourseMemberView {
  course_id: string;
  offer_id: string | null;
  access: CommerceCourseMemberAccess;
  title: string;
  description: string | null;
  content_kind: "course" | "video" | "pdf" | "article";
  cover_url: string | null;
  comments_enabled: boolean;
  sequential_access: boolean;
  club_included: boolean;
  organization: CommerceBusinessCard;
  presenter: CommerceProfessionalCard;
  progress: CommerceCourseMemberProgress;
  saved_lesson_ids: string[];
  modules: CommerceCourseMemberModule[];
}

export interface CommerceCourseModule {
  id: string;
  title: string;
  description: string | null;
  position: number;
  archived: boolean;
  lessons: CommerceCourseLesson[];
}

export interface CommerceCourseOutline {
  course_id: string;
  lesson_count: number;
  duration_seconds: number;
  club_included: boolean;
  modules: CommerceCourseOutlineModule[];
}

export interface CommerceCourseOutlineLesson {
  id: string;
  title: string;
  lesson_type: "mixed" | "text" | "video" | "audio" | "document";
  duration_seconds: number | null;
  is_preview: boolean;
}

export interface CommerceCourseOutlineModule {
  id: string;
  title: string;
  lessons: CommerceCourseOutlineLesson[];
}

export interface CommerceCoursePlayback {
  allowed: boolean;
  expires_at?: string | null;
}

export interface CommerceCoursePresenter {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface CommerceCourseProgramResource {
  kind: "program";
  id: string;
  title: string;
  sport_id: string;
  description: string | null;
  weeks: number;
  workouts_per_week: number;
  estimated_minutes_per_week: number | null;
}

export interface CommerceCourseProtocolResource {
  kind: "protocol";
  id: string;
  title: string;
  description: string | null;
  step_count: number;
  category: string | null;
  icon_key: string | null;
}

export interface CommerceCourseQuiz {
  required: boolean;
  pass_percent: number;
  questions: CommerceCourseQuizQuestion[];
}

export interface CommerceCourseQuizAnswer {
  question_id: string;
  option_id: string | null;
  correct: boolean;
  correct_option_id: string;
  explanation: string | null;
}

export interface CommerceCourseQuizOption {
  id: string;
  text: string;
}

export interface CommerceCourseQuizQuestion {
  id: string;
  prompt: string;
  options: CommerceCourseQuizOption[];
  correct_option_id: string;
  explanation: string | null;
}

export interface CommerceCourseQuizResult {
  best_percent: number;
  last_percent: number;
  passed: boolean;
  answered_at: string;
  answers: CommerceCourseQuizAnswer[];
}

export interface CommerceCourseSettings {
  sequential_access: boolean;
  club_included: boolean;
}

export interface CommerceCourseStudio {
  items: CommerceCourse[];
  total: number;
  limit: number;
  offset: number;
}

export interface CommerceCourseStudioDetail {
  course: CommerceCourse;
  club_available: boolean;
  ready: boolean;
  insights: CommerceCourseInsights;
}

export interface CommerceCourseWorkoutResource {
  kind: "workout";
  id: string;
  title: string;
  sport_id: string;
  notes: string | null;
  step_count: number;
}

export interface CommerceDeliveryAddress {
  line1: string;
  line2: string | null;
  district: string | null;
  city: string;
  state_code: string;
  postal_code: string;
  country_code: string;
}

export interface CommerceDietOfferDelivery {
  offer_id: string;
  business_id: string;
  offer_type: "standalone_diet";
  resource_id: string;
  resource: NutritionProfessionalDiet;
  version: number;
  offer_version: number;
  updated_at: string;
}

export interface CommerceFeaturedStore {
  id: string;
  business_id: string;
  slug: string;
  name: string;
  logo_url: string;
  cover_image_url?: string | null;
  tagline?: string | null;
  category?: string | null;
}

export interface CommerceFulfillment {
  kind?: "contract" | "community" | "challenge" | "course" | "club" | "workout" | "program" | "protocol" | "diet" | "physical_product" | "platform_membership";
  id?: string;
  offer_id?: string;
  status?: "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  tracking_code?: string | null;
  quantity?: number;
  shipping_method?: "shipping" | "pickup" | null;
  shipping_amount?: number | null;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  delivery_address?: CommerceDeliveryAddress | null;
  fulfillment_note?: string | null;
  pickup_instructions?: string | null;
  delivery_expected_at?: string | null;
  status_updated_at?: string | null;
  events?: CommerceFulfillmentEvent[];
}

export interface CommerceFulfillmentEvent {
  type: "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

export interface CommerceGooglePlayVerification {
  ok: boolean;
  has_access: boolean;
  purchase_id: string;
  status: "pending" | "confirmed" | "cancelled" | "refunded";
  acknowledged: boolean;
}

export interface CommerceMarket {
  items: CommerceOffer[];
  featured_stores: CommerceFeaturedStore[];
}

export interface CommerceMemberArea {
  continue: CommerceMemberItem | null;
  items: CommerceMemberItem[];
  total: number;
  limit: number;
  offset: number;
  ended: CommerceMemberItem[];
  saved: CommerceMemberSavedLesson[];
  professionals: CommerceProfessionalCard[];
  trending: CommerceMemberTrending[];
}

export interface CommerceMemberItem {
  course_id: string;
  offer_id: string | null;
  title: string;
  content_kind: "course" | "video" | "pdf" | "article";
  cover_url: string | null;
  organization: CommerceBusinessCard;
  presenter: CommerceProfessionalCard;
  access: CommerceMemberItemAccess;
  progress_percent: number;
  completed_lessons: number;
  total_lessons: number;
  last_lesson_id: string | null;
  last_opened_at: string | null;
}

export interface CommerceMemberItemAccess {
  source: "purchase" | "club" | null;
  expires_at: string | null;
  active: boolean;
}

export interface CommerceMemberSavedLesson {
  course_id: string;
  course_title: string;
  lesson_id: string;
  lesson_title: string;
  saved_at: string;
}

export interface CommerceMemberTrending {
  offer_id: string;
  course_id: string;
  title: string;
  image_url: string | null;
  content_kind: "course" | "video" | "pdf" | "article";
  presenter: CommerceProfessionalCard;
  organization: CommerceBusinessCard;
  price: number;
  currency: string;
  rating: number | null;
  reviews: number;
  learners: number;
}

export interface CommerceMyPhysicalOrder {
  id: string;
  product_id: string | null;
  offer_id: string;
  item_title: string;
  quantity: number;
  total_amount: number;
  currency: string;
  purchase_status: "pending" | "confirmed" | "failed" | "cancelled" | "refunded";
  fulfillment_status: "confirmed" | "preparing" | "shipped" | "ready_for_pickup" | "delivered" | "review";
  fulfillment_reference: string | null;
  shipping_method: "shipping" | "pickup" | null;
  shipping_amount: number;
  status_updated_at: string;
  created_at: string;
}

export interface CommerceMyPhysicalOrders {
  items: CommerceMyPhysicalOrder[];
  next_cursor: string | null;
}

export interface CommerceNativeProduct {
  offer_id: string;
  channel: "app_store" | "google_play";
  product_id: string;
  product_type: "auto_renewable_subscription" | "non_consumable" | "non_renewing_subscription" | "consumable";
  price: number;
  currency: string;
  subscription_group_reference: string | null;
  advanced_commerce: boolean;
  storefront: string | null;
  /** SKU da oferta resolvido pelo Core. Produto genérico da Apple é compartilhado e não identifica a oferta. */
  sku: string | null;
}

export interface CommerceOffer {
  delivery_resource_id?: string | null;
  id: string;
  business_id: string;
  professional_id: string;
  business: CommerceBusinessCard;
  professional: CommerceProfessionalCard;
  type: string;
  delivery: string;
  name: string;
  description?: string;
  image_url?: string | null;
  product_category_id?: string | null;
  product_category_label?: string | null;
  status: "draft" | "ready" | "published" | "paused" | "archived";
  price: number | null;
  currency: string;
  billing_type: "free" | "one_time" | "recurring";
  billing_interval?: "week" | "month" | "2month" | "quarter" | "semester" | "year" | null;
  settings: CommerceOfferSettings;
  target: CommerceOfferTarget;
  data_access_scope?: string[];
  version: number;
  first_sold_at?: string | null;
  created_at?: string;
  updated_at?: string;
  can_edit: boolean;
  course_outline?: CommerceCourseOutline;
}

export type CommerceOfferDelivery = CommerceProtocolOfferDelivery | CommerceProgramOfferDelivery | CommerceWorkoutOfferDelivery | CommerceDietOfferDelivery;

export interface CommerceOfferSale {
  id: string;
  buyer: OrgAccountCard;
  amount: number;
  currency: string;
  status: "pending" | "confirmed" | "failed" | "cancelled" | "refunded";
  created_at: string;
}

export interface CommerceOfferSales {
  items: CommerceOfferSale[];
  next_cursor: string | null;
}

export interface CommerceOfferSaveInput {
  delivery_resource_id?: string | null;
  id: string | null;
  business_id: string;
  type: string;
  name: string;
  description: string;
  image_url: string | null;
  price: number | null;
  currency: string;
  billing_type: "free" | "one_time" | "recurring";
  billing_interval: string | null;
  settings: CommerceOfferSettings;
  target: CommerceOfferTarget;
  data_access_scope: string[];
  expected_version: number | null;
  idempotency_key: string | null;
}

export interface CommerceOfferSettings {
  headline?: string;
  platform_fee_percent?: number;
  platform_fee_fixed?: number;
  benefits?: string[];
  delivery_notes?: string;
  subscriber_label?: string;
  includes_community?: boolean;
  format?: "online" | "in_person" | "hybrid";
  duration_minutes?: number;
  sessions_per_cycle?: number;
  deliverables?: string[];
  scheduling_notes?: string;
  intake_form_required?: boolean;
  welcome_message?: string;
  requires_physical_activity_risk_acknowledgement?: boolean;
  product_category?: string;
  fulfillment_type?: "shipping" | "pickup" | "digital" | "hybrid";
  stock_mode?: "limited" | "unlimited" | "preorder";
  stock?: number;
  sku?: string;
  shipping_policy?: string;
  access_duration?: string;
  apple_storefront_prices?: CommerceAppleStorefrontPrice[];
}

export interface CommerceOfferTarget {
  group_id?: string;
}

export interface CommerceOfferingTool {
  key: string;
  required_scopes: ("training" | "diet" | "protocols" | "health")[];
  enabled: boolean;
  version: number;
}

export interface CommerceOfferingTools {
  offer_id: string;
  offer_type: string;
  items: CommerceOfferingTool[];
}

export interface CommerceOffers {
  can_edit: boolean;
  items: CommerceOffer[];
}

export interface CommerceOrders {
  items: CommercePhysicalOrder[];
  next_cursor: string | null;
}

export interface CommercePayment {
  id: string;
  purchase_id: string;
  kind: string;
  status: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  occurred_at: string;
}

export interface CommercePaymentCard {
  id: string;
  brand: string;
  last4: string;
  nickname: string | null;
  is_default: boolean;
  created_at: string;
}

export interface CommercePaymentCards {
  items: CommercePaymentCard[];
  next_cursor: string | null;
}

export interface CommercePayments {
  items: CommercePayment[];
  next_cursor: string | null;
}

export interface CommercePayout {
  id: string;
  status: "pending_approval";
  amount: number;
  currency: string;
  destination: CommercePayoutDestinationSummary;
  version: number;
}

export interface CommercePayoutDestination {
  kind: "pix" | "bank";
  value: string;
}

export interface CommercePayoutDestinationSummary {
  kind: "pix" | "bank";
  last4: string;
}

export interface CommercePhysicalAddress {
  line1: string;
  line2: string | null;
  district: string | null;
  city: string;
  state_code: string;
  postal_code: string;
  country_code: string;
}

export interface CommercePhysicalArchive {
  action: "archive";
  product_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalBuyer {
  id: string;
  name: string;
  email: string | null;
}

export interface CommercePhysicalBuyerItem {
  id: string;
  offer_id: string;
  business_id: string;
  business_name: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category_key: string | null;
  price: number;
  currency: string;
  available_quantity: number | null;
  inventory_mode: "tracked" | "preorder";
  max_quantity_per_order: number;
  shipping_enabled: boolean;
  pickup_enabled: boolean;
  estimated_days: number | null;
  pickup_instructions: string | null;
  cover_url: string | null;
  media: CommercePhysicalMedia[];
  rating: number;
  review_count: number;
  updated_at: string;
}

export interface CommercePhysicalCatalog {
  items: CommercePhysicalProduct[];
  next_cursor: string | null;
  operations: CommercePhysicalOperations;
  sales: CommercePhysicalSales[];
}

export interface CommercePhysicalCheckoutAddress {
  line1: string;
  line2: string | null;
  district: string | null;
  city: string;
  state_code: string;
  postal_code: string;
  country_code: string;
}

export interface CommercePhysicalCheckoutInput {
  product_id: string;
  quantity: number;
  shipping_method: "shipping" | "pickup";
  state_code: string | null;
  recipient_name: string;
  recipient_phone: string | null;
  delivery_address: CommercePhysicalCheckoutAddress | null;
}

export interface CommercePhysicalDuplicate {
  action: "duplicate";
  product_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalInventory {
  items: CommercePhysicalInventoryEvent[];
  next_cursor: string | null;
}

export interface CommercePhysicalInventoryEvent {
  id: number;
  event_type: "created" | "manual_adjustment" | "reservation" | "reservation_release" | "sale" | "restock";
  delta: number;
  reserved_delta: number;
  quantity_after: number;
  quantity_reserved_after: number;
  note: string | null;
  created_at: string;
}

export interface CommercePhysicalLowStock {
  id: string;
  title: string;
  available: number;
  threshold: number;
}

export interface CommercePhysicalMarket {
  items: CommercePhysicalBuyerItem[];
  next_cursor: string | null;
}

export interface CommercePhysicalMedia {
  id: string;
  file_id: string;
  media_type: "image" | "video";
  url: string;
  position: number;
  is_cover: boolean;
}

export type CommercePhysicalMediaCommand = CommercePhysicalMediaCover | CommercePhysicalMediaRemove | CommercePhysicalMediaReorder;

export interface CommercePhysicalMediaComplete {
  action: "complete";
  request_id: string;
  product_id: string;
  expected_version: number;
  position: number;
  cover: boolean;
  idempotency_key: string;
}

export interface CommercePhysicalMediaCover {
  action: "set_cover";
  product_id: string;
  media_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalMediaPending {
  file_id: string;
  status: "pending";
  upload_url: string;
  upload_headers: CommercePhysicalUploadHeaders;
  expires_in: number;
}

export interface CommercePhysicalMediaPrepare {
  action: "prepare";
  request_id: string;
  product_id: string;
  filename: string;
  mime: "image/jpeg" | "image/png" | "image/webp" | "video/mp4";
  bytes: number;
}

export interface CommercePhysicalMediaReady {
  file_id: string;
  status: "ready";
  product: CommercePhysicalProduct;
}

export interface CommercePhysicalMediaRemove {
  action: "remove";
  product_id: string;
  media_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalMediaReorder {
  action: "reorder";
  product_id: string;
  media_ids: string[];
  expected_version: number;
  idempotency_key: string;
}

export type CommercePhysicalMediaUpload = CommercePhysicalMediaPending | CommercePhysicalMediaReady;

export type CommercePhysicalMediaUploadInput = CommercePhysicalMediaPrepare | CommercePhysicalMediaComplete;

export interface CommercePhysicalOperations {
  actionable_orders: number;
  awaiting_payment_orders: number;
  fulfilled_orders: number;
  gross_paid_amount: number;
  refunded_amount: number;
  net_paid_amount: number;
  out_of_stock_count: number;
  low_stock_items: CommercePhysicalLowStock[];
}

export interface CommercePhysicalOrder {
  id: string;
  offer_id: string;
  product_id: string | null;
  item_title: string;
  quantity: number;
  total_amount: number;
  shipping_amount: number;
  currency: string;
  status: "awaiting_payment" | "payment_failed" | "confirmed" | "preparing" | "shipped" | "ready_for_pickup" | "delivered" | "cancelled" | "refunded" | "review";
  shipping_method: "shipping" | "pickup";
  buyer: CommercePhysicalBuyer;
  recipient_name: string | null;
  recipient_phone: string | null;
  delivery_address: CommercePhysicalAddress | null;
  fulfillment_note: string | null;
  fulfillment_reference: string | null;
  pickup_instructions: string | null;
  delivery_expected_at: string | null;
  delivery_expected_original_at: string | null;
  delivery_expected_changed_at: string | null;
  delivery_delay_note: string | null;
  created_at: string;
  status_updated_at: string;
  version: number;
}

export type CommercePhysicalOrderCommand = CommercePhysicalOrderPrepare | CommercePhysicalOrderShip | CommercePhysicalOrderReady | CommercePhysicalOrderDeliver | CommercePhysicalOrderExpectation | CommercePhysicalOrderNotify | CommercePhysicalOrderReview;

export interface CommercePhysicalOrderDeliver {
  action: "deliver";
  purchase_id: string;
  note: string | null;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalOrderExpectation {
  action: "update_expectation";
  purchase_id: string;
  expected_at: string;
  note: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalOrderNotify {
  action: "resend_notification";
  purchase_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalOrderPrepare {
  action: "prepare";
  purchase_id: string;
  note: string | null;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalOrderReady {
  action: "ready_for_pickup";
  purchase_id: string;
  note: string | null;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalOrderReview {
  action: "resolve_review";
  purchase_id: string;
  note: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalOrderShip {
  action: "ship";
  purchase_id: string;
  reference: string;
  note: string | null;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalProduct {
  id: string;
  offer_id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category_key: string | null;
  price: number;
  currency: string;
  status: "draft" | "active" | "paused" | "archived";
  stock_on_hand: number;
  stock_reserved: number;
  available_stock: number;
  low_stock_threshold: number;
  inventory_mode: "tracked" | "preorder";
  max_quantity_per_order: number;
  auto_pause_when_out_of_stock: boolean;
  shipping_enabled: boolean;
  pickup_enabled: boolean;
  flat_rate: number;
  state_rates: CommercePhysicalStateRate[];
  free_shipping_threshold: number | null;
  estimated_days: number | null;
  pickup_instructions: string | null;
  cover_url: string | null;
  media: CommercePhysicalMedia[];
  version: number;
  created_at: string;
  updated_at: string;
}

export type CommercePhysicalProductCommand = CommercePhysicalArchive | CommercePhysicalRestore | CommercePhysicalDuplicate | CommercePhysicalStockAdjust;

export interface CommercePhysicalProductInput {
  id: string | null;
  offer_id: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category_key: string | null;
  price: number;
  status: "draft" | "active" | "paused";
  stock_on_hand: number;
  low_stock_threshold: number;
  inventory_mode: "tracked" | "preorder";
  max_quantity_per_order: number;
  auto_pause_when_out_of_stock: boolean;
  shipping_enabled: boolean;
  pickup_enabled: boolean;
  flat_rate: number;
  state_rates: CommercePhysicalStateRateInput[];
  free_shipping_threshold: number | null;
  estimated_days: number | null;
  pickup_instructions: string | null;
  expected_version: number | null;
  idempotency_key: string;
}

export interface CommercePhysicalQuote {
  product_id: string;
  offer_id: string;
  quantity: number;
  shipping_method: "shipping" | "pickup";
  subtotal: number;
  shipping_amount: number;
  total_amount: number;
  currency: string;
  estimated_days: number | null;
  pickup_instructions: string | null;
  available_quantity: number | null;
}

export interface CommercePhysicalRestore {
  action: "restore";
  product_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalSales {
  product_id: string;
  title: string;
  units_sold: number;
  gross_amount: number;
  refunded_amount: number;
  net_amount: number;
  available_stock: number | null;
}

export interface CommercePhysicalStateRate {
  state_code: string;
  amount: number;
}

export interface CommercePhysicalStateRateInput {
  state_code: string;
  amount: number;
}

export interface CommercePhysicalStockAdjust {
  action: "adjust_stock";
  product_id: string;
  delta: number;
  note: string;
  expected_version: number;
  idempotency_key: string;
}

export interface CommercePhysicalUploadHeaders {
  "Content-Type": string;
  "Content-Length": string;
}

export interface CommerceProfessionalCard {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
}

export interface CommerceProgramOfferDelivery {
  offer_id: string;
  business_id: string;
  offer_type: "standalone_program";
  resource_id: string;
  resource: TrainingProfessionalProgram;
  version: number;
  offer_version: number;
  updated_at: string;
}

export interface CommerceProgressInput {
  lesson: string;
  component_key: string;
  asset_id?: string | null;
  position_seconds: number;
  total_seconds?: number | null;
  consumed_ratio?: number | null;
  page?: number | null;
  total_pages?: number | null;
}

export interface CommerceProgressResult {
  course_id: string;
  lesson_id: string;
  status: "in_progress" | "completed";
  completed: boolean;
  progress: CommerceCourseMemberProgress;
}

export interface CommercePromotedOffers {
  items: CommerceOffer[];
}

export interface CommerceProtocolOfferDelivery {
  offer_id: string;
  business_id: string;
  offer_type: "standalone_protocol";
  resource_id: string;
  resource: TrainingProfessionalProtocolTemplate;
  version: number;
  offer_version: number;
  updated_at: string;
}

export interface CommercePurchase {
  id: string;
  offer_id: string;
  offer: CommerceOffer;
  status: string;
  channel: string;
  amount: number;
  currency: string;
  offer_name?: string;
  billing_type?: string;
  billing_interval?: string | null;
  provider_reference?: string | null;
  contract_id?: string | null;
  subscription_id?: string | null;
  confirmed_at?: string | null;
  created_at?: string;
  fulfillment: CommerceFulfillment;
  access_ended_at: string | null;
  subscription_status: string | null;
  subscription_management: CommerceSubscriptionManagement | null;
  progress: CommercePurchaseProgress;
  version: number;
  charges: CommerceCharge[];
}

export interface CommercePurchaseAssetProgress {
  asset_id: string;
  ratio: number;
  position_seconds: number | null;
  page: number | null;
  total_pages: number | null;
}

export interface CommercePurchaseLessonProgress {
  lesson_id: string;
  status: "in_progress" | "completed";
  position_seconds: number;
  body_ratio: number;
  assets: CommercePurchaseAssetProgress[];
}

export interface CommercePurchaseProgress {
  percent?: number;
  last_lesson_id?: string | null;
  last_position_seconds?: number;
  lessons?: CommercePurchaseLessonProgress[];
}

export interface CommercePurchaseSummary {
  id: string;
  offer_id: string;
  offer: CommerceOffer;
  status: "pending" | "confirmed" | "failed" | "cancelled" | "refunded";
  channel: string;
  amount: number;
  currency: string;
  offer_name: string;
  billing_type: "free" | "one_time" | "recurring";
  billing_interval?: string | null;
  provider_reference?: string | null;
  contract_id?: string | null;
  subscription_id?: string | null;
  confirmed_at?: string | null;
  created_at: string;
  fulfillment: CommerceFulfillment;
  access_ended_at: string | null;
  subscription_status: string | null;
  progress: CommercePurchaseProgress;
  version: number;
}

export interface CommercePurchases {
  items: CommercePurchaseSummary[];
  next_cursor: string | null;
}

export interface CommerceReview {
  id: string;
  offer_id: string;
  purchase_id: string;
  rating: number;
  comment?: string | null;
  author: CommerceReviewAuthor;
  seller_reply?: string | null;
  created_at: string;
  updated_at?: string;
  version: number;
}

export interface CommerceReviewAuthor {
  name: string;
}

export interface CommerceReviewContext {
  can_review: boolean;
  rating: number;
  review_count: number;
  eligible_purchase_id: string | null;
  review_kind: "one_time" | "recurring";
  my_review?: CommerceReview | null;
}

export interface CommerceReviewReport {
  id: string;
  status: "received";
}

export interface CommerceReviews {
  items: CommerceReview[];
  total: number;
  next_cursor: string | null;
}

export interface CommerceStorefrontOffers {
  items: CommerceOffer[];
  next_cursor: string | null;
}

export interface CommerceSubscriptionCancelResult {
  action_id: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  subscription_id: string;
}

export interface CommerceSubscriptionCancellationAction {
  action_id: string;
  status: "pending" | "processing" | "succeeded" | "failed";
}

export interface CommerceSubscriptionManagement {
  subscription_id: string;
  can_cancel: boolean;
  status: string;
  auto_renews: boolean;
  current_period_end: string | null;
  cancellation_effect: "period_end" | "immediate" | "unsupported";
  cancellation_action: CommerceSubscriptionCancellationAction | null;
}

export interface CommerceSubscriptionRecoveryResult {
  action_id: string;
  status: "succeeded";
  subscription_id: string;
  provider_action_reference: string;
  recovery_url: string | null;
}

export interface CommerceTranscriptCue {
  start_seconds: number;
  end_seconds: number;
  text: string;
}

export interface CommerceWallet {
  business_id: string;
  balances: CommerceWalletBalance[];
  payouts: CommerceWalletPayout[];
}

export interface CommerceWalletBalance {
  currency: string;
  available: number;
}

export interface CommerceWalletPayout {
  id: string;
  status: string;
  amount: number;
  currency: string;
  destination: CommercePayoutDestinationSummary;
  requested_at: string;
  processed_at: string | null;
  version: number;
}

export interface CommerceWorkoutOfferDelivery {
  offer_id: string;
  business_id: string;
  offer_type: "standalone_workout";
  resource_id: string;
  resource: ProfessionalWorkoutTemplate;
  version: number;
  offer_version: number;
  updated_at: string;
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

export interface CompositionalPrescription {
  engine: "compositional";
  sport_name?: string;
  execution_items: ExecutionItem[];
}

export interface ConsultancyAccessDecision {
  item: "training" | "diet" | "protocols" | "health";
  decision: "requested" | "allowed" | "denied" | "revoked";
  decided_at: string | null;
  decided_by?: string | null;
}

export interface ConsultancyBusiness {
  id: string;
  name: string;
  logo_url: string;
}

export interface ConsultancyConsentResult {
  contract_id: string;
  status: "active" | "past_due" | "ended";
  version: number;
  access: ConsultancyAccessDecision[];
}

export interface ConsultancyContractEndResult {
  contract_id: string;
  status: "ended";
  ended_at: string;
  ended_by: string;
  reason: string;
  subscription_canceled: boolean;
  cancellation_pending: boolean;
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
  settings: CommerceOfferSettings;
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
  /** Cabeçalhos de upload definidos pelo provedor, com valores textuais. */
  uploadHeaders: Record<string, string>;
  contentType: string;
  contentLength: number;
  expiresIn: number;
}

export interface CrossfitPrescription {
  engine: "crossfit";
  blocks: WorkoutBlock[];
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
  /** Dieta própria e cópia comprada são editáveis pelo dono. Templates, versão adquirida e cópias de outros usuários permanecem intactos. */
  editable: boolean;
  targets: DietTargets;
  meals: DietMeal[];
  updated_at: string;
  version: number;
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
  idempotency_key: string;
  /** Obrigatório ao atualizar; omitido ao criar. */
  expected_version?: number;
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
  version: number;
  updated_at: string;
}

export interface DietTargets {
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
}

export interface EndurancePrescription {
  engine: "endurance";
  kind: "warmup" | "interval" | "recovery" | "cooldown";
  by: "time" | "distance";
  value: number;
  stroke?: "free" | "back" | "breast" | "fly" | "im" | "kick" | "drill";
  target?: EnduranceTarget;
  repeat?: number;
  repeat_index?: number;
  repeat_total?: number;
  rest_s?: number;
  sendoff_s?: number;
  pool_length_m?: 25 | 50;
  cadence_rpm?: number;
  elevation_gain_m?: number;
  terrain?: "road" | "track" | "trail" | "treadmill" | "indoor" | "outdoor" | "pool" | "open_water";
  equipment?: string[];
  notes?: string;
}

export interface EnduranceTarget {
  zone?: "z1" | "z2" | "z3" | "z4" | "z5" | "z6";
  zone_label?: string;
  power_label?: string;
  target_label?: string;
  pct_ftp?: number;
  pace_s_per_km?: number;
  pace_min_s_per_km?: number;
  pace_max_s_per_km?: number;
  hr_bpm?: number;
  rpe?: string | number;
}

export interface EventsSaved {
  accepted: number;
  duplicates: number;
  rejected: number;
}

export type ExecutionDetails = Record<string, string | number | boolean>;

export interface ExecutionItem {
  id: string;
  title: string;
  kind: "work" | "rest" | "transition" | "instruction";
  measure: "time" | "distance" | "reps" | "rounds" | "calories" | "none";
  value?: number;
  unit?: "s" | "min" | "m" | "km" | "reps" | "rounds" | "kcal";
  intensity?: string;
  notes?: string;
  details: ExecutionDetails;
  series?: ExecutionSeries[];
}

export interface ExecutionSeries {
  reps?: string | number;
  load?: string | number;
  rpe?: string | number;
  rest_s?: string | number;
  cadence?: string | number;
  notes?: string;
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

export interface FoodSaveInput {
  id: string | null;
  name: string;
  brand: string | null;
  category: string | null;
  notes: string | null;
  barcode: string | null;
  per_100g: NutritionFactsInput;
  portions: FoodSavePortion[];
  delete?: boolean;
}

export interface FoodSavePortion {
  amount: number;
  unit: string;
  label: string | null;
  grams: number;
}

export interface FoodSource {
  id: string;
  name_key: string;
  origin: "taco" | "tbca" | "usda" | "brand" | "restaurant" | "personal";
  display_name_key: string;
  license_name: string | null;
  license_url: string | null;
  attribution_text: string | null;
  homepage_url: string | null;
  verified_by_default: boolean;
  search_priority: number;
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
  /** file_id pronto e pertencente à pessoa; null remove a foto atual */
  photo?: MealPhotoInput | null;
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

export interface HealthAdherence {
  id: string;
  title: string;
  protocol_id: string;
  protocol_title: string;
  status: "done" | "not_done";
  occurred_at: string;
  reason: string | null;
  note: string | null;
}

export interface HealthAnamnesisQuestionnaireSaveInput {
  id: string | null;
  business_id: string;
  kind: "anamnesis";
  title: string;
  expected_version: number | null;
  idempotency_key: string;
  questions: HealthProfessionalQuestionInput[];
  recurrence: HealthAnamnesisRecurrenceInput;
}

export interface HealthAnamnesisRecurrenceInput {
  general_instructions?: string | null;
}

export type HealthAnswerValue = HealthTextAnswer | HealthNumberAnswer | HealthBooleanAnswer | HealthChoicesAnswer | HealthRatingsAnswer;

/** Mapa em que cada chave é o ID de uma pergunta do snapshot. */
export type HealthAnswers = Record<string, HealthAnswerValue>;

/** Mapa em que cada chave é o ID de uma pergunta do snapshot. */
export type HealthAnswersInput = Record<string, HealthAnswerValue>;

export interface HealthAssistant {
  conversation_id: string | null;
  conversations: HealthAssistantConversation[];
  items: HealthAssistantHistoryMessage[];
  next_cursor: string | null;
  usage: HealthAssistantUsage;
}

export interface HealthAssistantActionResult {
  id: string;
  status: "archived";
}

export interface HealthAssistantConversation {
  id: string;
  title: string;
  updated_at: string;
}

export interface HealthAssistantHistoryMessage {
  id: string;
  role: "user" | "assistant";
  body: string;
  created_at: string;
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

export interface HealthAssistantUsage {
  messages: number;
}

export interface HealthBooleanAnswer {
  kind: "boolean";
  value: boolean;
}

export interface HealthBusinessQuestionnaire {
  id: string;
  root_id: string;
  business_id: string;
  kind: "anamnesis" | "check";
  title: string;
  questions: HealthProfessionalQuestion[];
  delivery_rules: HealthQuestionnaireDeliveryRule[];
  recurrence: HealthQuestionnaireRecurrence;
  version: number;
  status: "active" | "archived";
  updated_at: string;
}

export interface HealthBusinessResponse {
  id: string;
  questionnaire_id: string;
  account_id: string | null;
  status: "pending" | "draft" | "submitted" | "expired";
  submitted_at: string | null;
  created_at: string;
  reviewed_at: string | null;
  questionnaire: HealthFormQuestionnaire;
  /** Mapa em que cada chave é o ID de uma pergunta do snapshot. */
  answers: HealthAnswers;
  student: HealthBusinessResponseStudent | null;
  photos: HealthFileSummary[];
}

export interface HealthBusinessResponseStudent {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface HealthCheckQuestionnaireSaveInput {
  id: string | null;
  business_id: string;
  kind: "check";
  title: string;
  expected_version: number | null;
  idempotency_key: string;
  questions: HealthProfessionalQuestionInput[];
  recurrence: HealthCheckRecurrenceInput;
}

export interface HealthCheckRecurrenceInput {
  periodicity_days: number;
  ask_progress_photos: boolean;
  progress_photo_instructions: string | null;
  min_progress_photos: number | null;
}

export interface HealthChoicesAnswer {
  kind: "choices";
  value: string[];
}

export interface HealthClientAssistantHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface HealthClientAssistantReply {
  answer: string;
  context_record_count: number;
  context_truncated: boolean;
}

export interface HealthClientRecord {
  client_id: string;
  business_id: string;
  from: string;
  to: string;
  activities: TrainingActivityItem[];
  daily: HealthDailySummary[];
  events: HealthEvent[];
  reports: HealthReport[];
  files: HealthFileSummary[];
  questionnaires: HealthQuestionnairePending[];
  adherence: HealthAdherence[];
  responses: HealthQuestionnaireResponse[];
}

export interface HealthConsent {
  purpose: "profile_storage" | "ai_assistance";
  action: "granted" | "revoked" | null;
  policy_version: string;
  decided_at: string | null;
}

export interface HealthConsents {
  items: HealthConsent[];
}

export interface HealthDailyInput {
  date: string;
  /** Mapa dinâmico de métricas numéricas nomeadas pelo catálogo. */
  metrics: Record<string, number>;
}

export interface HealthDailySummary {
  date: string;
  source: "apple_health" | "health_connect" | "onlyfit";
  /** Mapa dinâmico de métricas numéricas nomeadas pelo catálogo. */
  metrics: Record<string, number>;
  received_at: string;
}

export interface HealthDateQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "date";
  label: string;
  required: boolean;
}

export interface HealthDateQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "date";
  label: string;
  required?: boolean;
  options?: null;
  scale_min?: null;
  scale_max?: null;
  scale_label_min?: null;
  scale_label_max?: null;
  rating_items?: null;
  rating_instruction?: null;
}

export interface HealthDocumentProcessResult {
  document_id: string;
  proposal: HealthDocumentProposal;
  used_ai: boolean;
}

export interface HealthDocumentProposal {
  title: string;
  category: "allergy" | "physical_assessment" | "procedure" | "exam" | "injury" | "other" | "sensation" | "treatment";
  effective_date: string | null;
  narrative: string;
  facts: HealthFact[];
  requires_manual_summary: boolean;
  warnings: string[];
  source_text_preview: string;
}

export interface HealthDocumentSummary {
  id: string;
  filename: string;
  mime_type: string;
  status: "pending" | "ready" | "failed";
}

export interface HealthEvent {
  id: string;
  kind: "allergy" | "physical_assessment" | "procedure" | "exam" | "injury" | "other" | "sensation" | "treatment" | "report";
  title: string;
  narrative: string | null;
  occurred_at: string;
  corrects_id: string | null;
  status: "draft" | "confirmed" | "published" | "superseded";
  facts: HealthFact[];
  document: HealthDocumentSummary | null;
  created_at: string;
}

export interface HealthEventDeleteResult {
  id: string;
  deleted: boolean;
}

export interface HealthEventInput {
  kind: "allergy" | "physical_assessment" | "procedure" | "exam" | "injury" | "other" | "sensation" | "treatment";
  title: string;
  narrative?: string | null;
  occurred_at?: string | null;
  corrects_id?: string | null;
  document_id?: string | null;
  facts?: HealthFactInput[];
}

export interface HealthFact {
  fact_type: string;
  canonical_key?: string | null;
  display: string;
  value_text: string | null;
  value_numeric: number | null;
  value_boolean: boolean | null;
  unit: string | null;
  reference_text: string | null;
  confidence: number;
}

export interface HealthFactInput {
  fact_type: string;
  canonical_key?: string | null;
  display: string;
  value_text: string | null;
  value_numeric: number | null;
  value_boolean: boolean | null;
  unit: string | null;
  reference_text: string | null;
  confidence: number;
}

export interface HealthFileAccess {
  id: string;
  url: string;
  expires_at: string;
}

export interface HealthFileDeleteResult {
  id: string;
  deleted: boolean;
}

export interface HealthFileMetadata {
  captured_at?: string;
  angle?: "front" | "side_left" | "side_right" | "back" | "scale";
  weight_kg?: number;
  body_fat_pct?: number;
  notes?: string;
  response_id?: string;
  business_id?: string;
}

export interface HealthFileSummary {
  id: string;
  kind: "health_document" | "progress_photo";
  filename: string;
  mime_type: string;
  bytes: number;
  status: "pending" | "ready" | "failed";
  created_at: string;
  metadata: HealthFileMetadata;
}

export interface HealthForm {
  response_id: string;
  questionnaire_id: string;
  business_id: string;
  target_account_id: string | null;
  version: number;
  response_version: number;
  questionnaire: HealthFormQuestionnaire;
  professional: HealthFormProfessional;
  business: HealthFormBusiness;
  /** Mapa em que cada chave é o ID de uma pergunta do snapshot. */
  answers: HealthAnswers;
  status: "pending" | "draft" | "submitted";
  expires_at: string | null;
  submitted_at: string | null;
}

export interface HealthFormBusiness {
  id: string;
  name: string;
  logo_url: string | null;
}

export interface HealthFormProfessional {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export interface HealthFormQuestionnaire {
  kind: "anamnesis" | "check";
  title: string;
  questions: HealthProfessionalQuestion[];
  recurrence: HealthQuestionnaireRecurrence;
}

export interface HealthHome {
  from: string;
  to: string;
  activities: ActivityItem[];
  daily: HealthDailySummary[];
  events: HealthEvent[];
  reports: HealthEvent[];
  files: HealthFileSummary[];
  questionnaires: HealthQuestionnairePending[];
  adherence: HealthAdherence[];
}

export interface HealthMultipleChoiceQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "multiple_choice";
  label: string;
  required: boolean;
  options: string[];
}

export interface HealthMultipleChoiceQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "multiple_choice";
  label: string;
  required?: boolean;
  options: string[];
  scale_min?: null;
  scale_max?: null;
  scale_label_min?: null;
  scale_label_max?: null;
  rating_items?: null;
  rating_instruction?: null;
}

export interface HealthNumberAnswer {
  kind: "number";
  value: number;
}

export interface HealthNumberQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "number";
  label: string;
  required: boolean;
}

export interface HealthNumberQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "number";
  label: string;
  required?: boolean;
  options?: null;
  scale_min?: null;
  scale_max?: null;
  scale_label_min?: null;
  scale_label_max?: null;
  rating_items?: null;
  rating_instruction?: null;
}

export interface HealthPendingForm {
  response_id: string;
  questionnaire_id: string;
  title: string;
  kind: "anamnesis" | "check";
  status: "pending" | "draft";
  expires_at: string;
  created_at: string;
}

export interface HealthPendingForms {
  items: HealthPendingForm[];
}

export type HealthProfessionalQuestion = HealthTextQuestion | HealthTextareaQuestion | HealthYesNoQuestion | HealthSingleChoiceQuestion | HealthMultipleChoiceQuestion | HealthScaleQuestion | HealthDateQuestion | HealthNumberQuestion | HealthRatingListQuestion;

export type HealthProfessionalQuestionInput = HealthTextQuestionInput | HealthTextareaQuestionInput | HealthYesNoQuestionInput | HealthSingleChoiceQuestionInput | HealthMultipleChoiceQuestionInput | HealthScaleQuestionInput | HealthDateQuestionInput | HealthNumberQuestionInput | HealthRatingListQuestionInput;

export interface HealthProgressPhotoInput {
  file_id: string;
  response_id?: string | null;
  captured_at: string;
  angle: "front" | "side_left" | "side_right" | "back" | "scale";
  weight_kg?: number | null;
  body_fat_pct?: number | null;
  notes?: string | null;
  replace_file_id?: string | null;
}

export interface HealthQuestionnaireDeliveryRule {
  scope: "business";
}

export interface HealthQuestionnairePending {
  response_id: string;
  questionnaire_id: string;
  title: string;
  kind: "anamnesis" | "check";
  status: "pending" | "draft";
}

export interface HealthQuestionnaireRecurrence {
  general_instructions?: string;
  periodicity_days?: number;
  ask_progress_photos?: boolean;
  progress_photo_instructions?: string;
  min_progress_photos?: number;
}

export interface HealthQuestionnaireResponse {
  id: string;
  questionnaire: HealthFormQuestionnaire;
  /** Mapa em que cada chave é o ID de uma pergunta do snapshot. */
  answers: HealthAnswers;
  submitted_at: string;
}

export type HealthQuestionnaireSaveInput = HealthAnamnesisQuestionnaireSaveInput | HealthCheckQuestionnaireSaveInput;

export interface HealthQuestionnaireSaved {
  id: string;
  root_id: string;
  business_id: string;
  kind: "anamnesis" | "check";
  title: string;
  questions: HealthProfessionalQuestion[];
  recurrence: HealthQuestionnaireRecurrence;
  version: number;
  status: "active" | "archived";
  updated_at: string;
}

export interface HealthQuestionnaireSubmission {
  id: string;
  questionnaire_id: string;
  version: number;
  status: "submitted";
  submitted_at: string;
}

export interface HealthQuestionnaires {
  items: HealthBusinessQuestionnaire[];
  responses: HealthBusinessResponse[];
}

export interface HealthRatingListQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "rating_list";
  label: string;
  required: boolean;
  scale_min: number;
  scale_max: number;
  scale_label_min?: string;
  scale_label_max?: string;
  rating_items: string[];
  rating_instruction?: string;
}

export interface HealthRatingListQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "rating_list";
  label: string;
  required?: boolean;
  options?: null;
  scale_min: number;
  scale_max: number;
  scale_label_min?: string | null;
  scale_label_max?: string | null;
  rating_items: string[];
  rating_instruction?: string | null;
}

/** Mapa em que cada chave é o ID estável do item avaliado. */
export type HealthRatingValues = Record<string, number>;

export interface HealthRatingsAnswer {
  kind: "ratings";
  /** Mapa em que cada chave é o ID estável do item avaliado. */
  value: HealthRatingValues;
}

export interface HealthReport {
  id: string;
  business_id: string;
  client_id: string;
  period_start: string;
  period_end: string;
  report_type: "weekly" | "monthly" | "custom";
  summary: string | null;
  sections: HealthReportSections;
  ai_generated: boolean;
  status: "draft" | "published";
  version: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthReportSaveInput {
  id?: string | null;
  business_id: string;
  client_id: string;
  period_start: string;
  period_end: string;
  report_type: "weekly" | "monthly" | "custom";
  summary: string | null;
  sections: HealthReportSections;
  publish: boolean;
  ai_generated: boolean;
  expected_version: number | null;
  idempotency_key: string;
}

export interface HealthReportSections {
  training?: string;
  nutrition?: string;
  supplements?: string;
  photos?: string;
  clinical?: string;
}

export interface HealthScaleQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "scale";
  label: string;
  required: boolean;
  scale_min: number;
  scale_max: number;
  scale_label_min?: string;
  scale_label_max?: string;
}

export interface HealthScaleQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "scale";
  label: string;
  required?: boolean;
  options?: null;
  scale_min: number;
  scale_max: number;
  scale_label_min?: string | null;
  scale_label_max?: string | null;
  rating_items?: null;
  rating_instruction?: null;
}

export interface HealthSelfBooleanConfirmationQuestion {
  id: string;
  section: string;
  section_title: string;
  type: "boolean_confirmation";
  label: string;
  required: boolean;
}

export interface HealthSelfBooleanQuestion {
  id: string;
  section: string;
  section_title: string;
  type: "boolean";
  label: string;
  required: boolean;
}

export interface HealthSelfChoiceOption {
  value: string;
  label: string;
}

export interface HealthSelfNumberQuestion {
  id: string;
  section: string;
  section_title: string;
  type: "number";
  label: string;
  required: boolean;
  help?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export type HealthSelfQuestion = HealthSelfBooleanQuestion | HealthSelfBooleanConfirmationQuestion | HealthSelfTextareaQuestion | HealthSelfNumberQuestion | HealthSelfSingleChoiceQuestion;

export interface HealthSelfQuestionnaire {
  id: string;
  key: string;
  title: string;
  description: string;
  version: number;
  questions: HealthSelfQuestion[];
  last_submitted_at: string | null;
}

export interface HealthSelfSingleChoiceQuestion {
  id: string;
  section: string;
  section_title: string;
  type: "single_choice";
  label: string;
  required: boolean;
  help?: string;
  options: HealthSelfChoiceOption[];
}

export interface HealthSelfTextareaQuestion {
  id: string;
  section: string;
  section_title: string;
  type: "textarea";
  label: string;
  required: boolean;
  help?: string;
  visible_when?: HealthSelfVisibilityCondition;
}

export interface HealthSelfVisibilityCondition {
  any_true: string[];
}

export interface HealthSingleChoiceQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "single_choice";
  label: string;
  required: boolean;
  options: string[];
}

export interface HealthSingleChoiceQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "single_choice";
  label: string;
  required?: boolean;
  options: string[];
  scale_min?: null;
  scale_max?: null;
  scale_label_min?: null;
  scale_label_max?: null;
  rating_items?: null;
  rating_instruction?: null;
}

export interface HealthTextAnswer {
  kind: "text";
  value: string;
}

export interface HealthTextQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "text";
  label: string;
  required: boolean;
}

export interface HealthTextQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "text";
  label: string;
  required?: boolean;
  options?: null;
  scale_min?: null;
  scale_max?: null;
  scale_label_min?: null;
  scale_label_max?: null;
  rating_items?: null;
  rating_instruction?: null;
}

export interface HealthTextareaQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "textarea";
  label: string;
  required: boolean;
}

export interface HealthTextareaQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "textarea";
  label: string;
  required?: boolean;
  options?: null;
  scale_min?: null;
  scale_max?: null;
  scale_label_min?: null;
  scale_label_max?: null;
  rating_items?: null;
  rating_instruction?: null;
}

export interface HealthUpload {
  id: string;
  kind: "health_document" | "progress_photo";
  status: "pending" | "ready";
  url: string | null;
  /** Cabeçalhos de upload definidos pelo provedor, com valores textuais. */
  upload_headers: Record<string, string> | null;
  expires_in: number | null;
}

export interface HealthUploadInput {
  action: "prepare" | "complete";
  id: string | null;
  filename: string | null;
  mime: string | null;
  bytes: number | null;
}

export interface HealthWearable {
  connection: HealthWearableConnection | null;
  daily: HealthDailySummary[];
}

export interface HealthWearableConnection {
  provider: "apple_health" | "health_connect";
  status: "connected" | "denied" | "unknown";
  last_sync_at: string;
  last_error: string | null;
}

export interface HealthWearableSyncInput {
  provider: "apple_health" | "health_connect";
  permission_status: "granted" | "partial" | "denied" | "unknown";
  device_id: string;
  app_version: string;
  idempotency_key: string;
  daily: HealthDailyInput[];
}

export interface HealthWearableSyncResult {
  provider: "apple_health" | "health_connect";
  status: "connected" | "denied" | "unknown";
  saved_days: number;
  synced_at: string;
}

export interface HealthYesNoQuestion {
  id: string;
  section?: string;
  section_title?: string;
  section_observations?: string;
  type: "yes_no";
  label: string;
  required: boolean;
}

export interface HealthYesNoQuestionInput {
  id: string;
  section?: string | null;
  section_title?: string | null;
  section_observations?: string | null;
  type: "yes_no";
  label: string;
  required?: boolean;
  options?: null;
  scale_min?: null;
  scale_max?: null;
  scale_label_min?: null;
  scale_label_max?: null;
  rating_items?: null;
  rating_instruction?: null;
}

export interface HyroxPrescription {
  engine: "hyrox";
  blocks: WorkoutBlock[];
}

export interface IdentityAcceptance {
  key: string;
  version: string;
}

export interface IdentityAccess {
  status: "confirm_email" | "waitlist" | "granted";
  invite_code: IdentityInviteCode;
}

export interface IdentityAccount {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string;
  social_links: IdentitySocialLinks;
  is_professional: boolean;
  professional_vertical: string | null;
}

export interface IdentityAddress {
  id: string;
  label?: string | null;
  recipient_name?: string | null;
  line1: string;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  country_code: string;
  is_default?: boolean;
}

export interface IdentityAddressInput {
  id?: string;
  label?: string | null;
  recipient_name?: string | null;
  line1: string;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  country_code: string;
  is_default?: boolean;
}

export interface IdentityBootstrap {
  account: IdentityAccount;
  private: IdentityPrivate;
  preferences: IdentityPreferences;
  interests: string[];
  addresses: IdentityAddress[];
  access: IdentityAccess;
  onboarding: IdentityOnboardingStatus;
  legal_pending: IdentityLegalDocument[];
  document: IdentityDocumentStatus;
}

export interface IdentityDeleteResult {
  ok: boolean;
}

export interface IdentityDocumentStatus {
  present: boolean;
  last4: string | null;
}

export interface IdentityInviteCode {
  code: string | null;
  uses: number | null;
  max_uses: number | null;
}

export interface IdentityLegalAcceptance {
  key: string;
  version: string;
}

export interface IdentityLegalDocument {
  key: string;
  version: string;
  kind: "acceptance" | "notice" | "declaration";
  title: string;
  url: string;
  required: boolean;
}

export interface IdentityOnboardingInput {
  goal: string;
  birth_date: string;
  level: string;
  interests: string[];
  legal: IdentityLegalAcceptance[];
}

export interface IdentityOnboardingSaveInput {
  goal: string;
  birth_date: string;
  level: string;
  interests: string[];
  legal: IdentityLegalAcceptance[];
}

export interface IdentityOnboardingStatus {
  done: boolean;
  missing: ("goal" | "birth_date" | "interests" | "level")[];
}

export interface IdentityPendingAcknowledged {
  status: "acknowledged";
  ok: boolean;
}

export interface IdentityPendingAuthenticated {
  status: "authenticated";
  ok: boolean;
  email: string;
  full_name: string;
  username: string;
  birth_date: string | null;
  goal: string | null;
  experience_level: string | null;
  interests: string[];
  onboarding_completed: boolean;
  email_confirmed: boolean;
  email_changed: boolean;
  session: IdentitySession;
}

export interface IdentityPendingBootstrapCommand {
  action: "bootstrap";
  token: string;
}

export type IdentityPendingCommand = IdentityPendingBootstrapCommand | IdentityPendingUpdateAccountCommand | IdentityPendingCompleteCommand | IdentityPendingResendCommand | IdentityPendingResendByEmailCommand | IdentityPendingStatusCommand | IdentityPendingDiscardCommand;

export interface IdentityPendingCompleteCommand {
  action: "complete";
  token: string;
  onboarding: IdentityOnboardingInput;
}

export interface IdentityPendingDiscardCommand {
  action: "discard";
  token: string;
}

export interface IdentityPendingProfile {
  status: "pending";
  ok: boolean;
  email: string;
  full_name: string;
  username: string;
  birth_date: string | null;
  goal: string | null;
  experience_level: string | null;
  interests: string[];
  onboarding_completed: boolean;
  email_confirmed: boolean;
  email_changed: boolean;
}

export interface IdentityPendingResendByEmailCommand {
  action: "resendByEmail";
  email: string;
}

export interface IdentityPendingResendCommand {
  action: "resend";
  token: string;
}

export type IdentityPendingResult = IdentityPendingAcknowledged | IdentityPendingProfile | IdentityPendingAuthenticated;

export interface IdentityPendingStatusCommand {
  action: "status";
  token: string;
}

export interface IdentityPendingUpdateAccountCommand {
  action: "updateAccount";
  token: string;
  full_name: string;
  username: string;
  email: string;
}

export interface IdentityPreferences {
  settings: IdentityPreferencesSettings;
  version: number;
}

export interface IdentityPreferencesPatch {
  locale?: "pt-BR" | "pt-PT" | "en-US" | "es";
  theme?: "system" | "light" | "dark";
  push_marketing?: boolean;
  timezone?: string;
  font_scale?: number;
  video_preload?: "automatic" | "data-saver" | "more-fluid";
}

export interface IdentityPreferencesPatchBlock {
  settings: IdentityPreferencesPatch;
  expected_version: number;
}

export interface IdentityPreferencesSettings {
  locale: "pt-BR" | "pt-PT" | "en-US" | "es";
  theme: "system" | "light" | "dark";
  push_marketing: boolean;
  timezone?: string;
  font_scale?: number;
  video_preload?: "automatic" | "data-saver" | "more-fluid";
}

export interface IdentityPrivate {
  phone: string | null;
  birth_date: string | null;
  country_code: string | null;
  goal: string | null;
  level: string | null;
}

export interface IdentityPrivatePatch {
  phone?: string | null;
  birth_date?: string | null;
  country_code?: string | null;
  goal?: string | null;
  level?: string;
}

export interface IdentityProfilePatch {
  public?: IdentityPublicPatch;
  private?: IdentityPrivatePatch;
  preferences?: IdentityPreferencesPatchBlock;
  interests?: string[];
  addresses?: IdentityAddressInput[];
  legal?: IdentityLegalAcceptance[];
}

export interface IdentityPublicPatch {
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
  bio?: string;
  social_links?: IdentitySocialLinksPatch;
  is_professional?: boolean;
  professional_vertical?: string | null;
}

export interface IdentityRecoveryResult {
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

export interface IdentitySignUpResult {
  email: string;
  pending_token: string;
  expires_at: string;
}

export interface IdentitySocialLinks {
  instagram?: string | null;
  tiktok?: string | null;
  whatsapp?: string | null;
  youtube?: string | null;
  website?: string | null;
}

export interface IdentitySocialLinksPatch {
  instagram?: string | null;
  tiktok?: string | null;
  whatsapp?: string | null;
  youtube?: string | null;
  website?: string | null;
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
  metrics: Record<string, number>;
  scheduled_id?: string;
  title?: string;
  /** Quem gravou (J20.5): app, aparelho e fuso. */
  origin?: ActivityOriginInput;
  route?: RoutePointInput[];
  /** Resultados por identificador de passo. */
  steps_done?: TrainingStepActualMap;
}

export interface InteractionLikers {
  items: SocialProfileReadCard[];
  total: number;
  next_cursor: number | null;
}

export interface InteractionThread {
  target: SocialPost;
  items: SocialPost[];
  next_cursor: string | null;
}

export interface LegalCenter {
  documents: AcceptedLegalDocument[];
  contracts: LegalContractTerm[];
}

export interface LegalContractTerm {
  contract_id: string;
  status: "active" | "past_due" | "ended";
  offering_name: string;
  professional_name: string;
  document_title: string;
  document_version: string;
  document_url: string;
  accepted_at: string;
  ended_at: string | null;
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
  /** Mapa dinâmico de métricas numéricas nomeadas pelo catálogo. */
  metrics: Record<string, number>;
  link_method: "session" | "exact" | "auto" | "manual";
}

/** mark: status, reason?, note?, photo?; edit: title, time?; removePhoto não exige input. */
export interface MealActionInput {
  status?: "done" | "not_done";
  reason?: string;
  note?: string;
  title?: string;
  /** HH:MM */
  time?: string;
  /** file_id pronto e pertencente à pessoa; null remove a foto atual */
  photo?: MealPhotoInput | null;
}

export interface MealPhoto {
  file_id: string;
  mime: string;
  bytes: number;
}

/** file_id pronto e pertencente à pessoa; null remove a foto atual */
export interface MealPhotoInput {
  file_id: string;
}

export interface MediaUpload {
  fileId: string | null;
  uploadUrl: string;
  /** Vazio para mídia privada; use objectKey com social.storyMediaAccess. */
  publicUrl: string;
  objectKey: string;
  bucket: string;
  uploaded: boolean;
  contentType: string;
  requestId: string;
  /** Cabeçalhos de upload definidos pelo provedor, com valores textuais. */
  uploadHeaders?: Record<string, string>;
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

export interface NutrientCatalogItem {
  id: string;
  name_key: string;
  unit: "kcal" | "g" | "mg" | "mcg";
  display_name_key: string;
}

export interface NutritionAdherenceDay {
  date: string;
  completed_meals: number;
  not_done_meals: number;
  pending_meals: number;
  adherence_percent: number;
  meals: NutritionAdherenceMeal[];
}

export interface NutritionAdherenceMeal {
  meal_id: string;
  status: "done" | "not_done" | null;
  note: string | null;
  /** Motivo canônico informado em nutrition.mealAct quando a refeição não foi feita. */
  deviation: string | null;
  logged_at: string | null;
  photo: NutritionAdherencePhoto | null;
}

export interface NutritionAdherencePhoto {
  file_id: string;
  mime: string;
  bytes: number;
}

export interface NutritionCalendarDay {
  date: string;
  planned: number;
  done: number;
  not_done: number;
  free_meals: number;
}

export interface NutritionCatalogCollection {
  id: string;
  title: string;
  description: string | null;
  published_to_students: boolean;
  active: boolean;
  updated_at: string;
  items: NutritionCatalogCollectionItem[];
}

export interface NutritionCatalogCollectionItem {
  id: string;
  note: string | null;
  position: number;
  food: NutritionFood;
}

export interface NutritionCatalogCollectionPage {
  items: NutritionCatalogCollection[];
  total: number;
  limit: number;
  offset: number;
}

export interface NutritionClientDiet {
  client_id: string;
  from: string;
  to: string;
  diet: NutritionProfessionalDiet | null;
  history: NutritionProfessionalDiet[];
  days: NutritionAdherenceDay[];
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

export interface NutritionDietAssistantResult {
  mode: "generate" | "adjust";
  proposal: NutritionDietProposal;
  requires_professional_review: true;
}

export interface NutritionDietItem {
  id: string;
  food_id?: string | null;
  name: string;
  quantity_g: number;
  quantity_value?: number | null;
  unit: string;
  kcal?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
  fiber_g?: number | null;
  notes?: string | null;
  order: number;
}

export interface NutritionDietItemInput {
  id?: string;
  food_id?: string | null;
  name: string;
  quantity_g: number;
  quantity_value?: number | null;
  unit: string;
  kcal?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
  fiber_g?: number | null;
  notes?: string | null;
}

export interface NutritionDietMeal {
  id: string;
  title: string;
  time?: string | null;
  critical: boolean;
  order: number;
  items: NutritionDietItem[];
}

export interface NutritionDietMealInput {
  id?: string;
  title: string;
  time?: string | null;
  critical?: boolean;
  items: NutritionDietItemInput[];
}

export interface NutritionDietProposal {
  title: string;
  objective: string;
  meals: NutritionDietMeal[];
  targets: NutritionTargets;
}

export interface NutritionDietProposalInput {
  title: string;
  objective: string;
  meals: NutritionDietMeal[];
  targets: NutritionTargets;
}

export interface NutritionFacts {
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sodium_mg: number | null;
  extended: NutritionNutrient[];
}

export interface NutritionFactsInput {
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sodium_mg: number | null;
  extended: NutritionNutrient[];
}

export interface NutritionFood {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  notes: string | null;
  origin: "taco" | "tbca" | "usda" | "brand" | "restaurant" | "personal";
  barcode: string | null;
  per_100g: NutritionFacts;
  portions: NutritionFoodPortion[];
  own: boolean;
}

export interface NutritionFoodPortion {
  amount: number;
  unit: string;
  label: string | null;
  grams: number;
}

export interface NutritionFoodSaveResult {
  id: string;
  deleted?: boolean;
  name?: string;
  brand?: string | null;
  category?: string | null;
  notes?: string | null;
  origin?: "taco" | "tbca" | "usda" | "brand" | "restaurant" | "personal";
  barcode?: string | null;
  per_100g?: NutritionFacts;
  portions?: NutritionFoodPortion[];
  own?: boolean;
}

export interface NutritionNutrient {
  code: string;
  amount_per_100g: number | null;
  unit: "kcal" | "g" | "mg" | "mcg";
  status: "measured" | "trace" | "not_available";
}

export interface NutritionPhotoDeleteResult {
  file_id: string;
  deleted: boolean;
}

export interface NutritionPhotoFile {
  file_id: string;
  url: string;
  expires_at: string;
}

export interface NutritionPhotoUpload {
  file_id: string;
  status: "pending" | "ready";
  upload_url: string | null;
  /** Cabeçalhos de upload definidos pelo provedor, com valores textuais. */
  upload_headers: Record<string, string> | null;
  expires_in: number | null;
}

export interface NutritionPhotoUploadInput {
  action: "prepare" | "complete";
  request_id: string;
  filename?: string | null;
  mime?: string | null;
  bytes?: number | null;
}

export interface NutritionProfessionalDiet {
  id: string;
  business_id: string;
  client_id: string | null;
  contract_id: string | null;
  source_diet_id: string | null;
  title: string;
  objective: string;
  targets: NutritionTargets;
  meals: NutritionDietMeal[];
  status: "draft" | "published" | "replaced" | "archived";
  active: boolean;
  version: number;
  prescribed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NutritionProfessionalLibrary {
  items: NutritionProfessionalDiet[];
  total: number;
  limit: number;
  offset: number;
}

export interface NutritionTargets {
  kcal?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
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
  allowed_billing_intervals?: ("week" | "month" | "2month" | "quarter" | "semester" | "year")[];
  minimum_price?: number;
  minimum_monthly_price?: number;
  /** Regiões configuráveis de ACA derivadas da política do Core. Não indicam produto Apple pronto, autorização de publicação ou disponibilidade de compra. Ausente em servidores anteriores: ocultar configuração, sem inferir por tipo de oferta. */
  apple_commerce_storefronts?: CommerceAppleStorefrontCapability[];
  max_per_business: number | null;
  unique_per_owner_profile: boolean;
  requires_affinity_group: boolean;
  requires_product_category: boolean;
  delivery: "club" | "consultancy" | "workout" | "program" | "protocol" | "diet" | "physical_product" | "course" | "challenge" | "community" | "platform_membership";
}

export interface OfficialWorkout {
  id: string;
  title: string;
  sport_id: string | null;
  steps: number;
  version: number;
  updated_at: string;
  scheduled: boolean;
}

export interface OrgAccountCard {
  id: string;
  username: string | null;
  display_name: string;
  avatar_url: string | null;
  is_professional: boolean;
}

export interface OrgCareTask {
  id: string;
  business_id: string;
  client_id: string;
  kind: "handoff" | "intervention" | "observation" | "follow_up";
  title: string;
  detail: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "done";
  target: "nutritionist" | "personal_trainer" | "hybrid_professional" | "student" | "shared";
  source: "manual" | "suggested" | "automation";
  context_tag: string | null;
  due_at: string | null;
  author: OrgAccountCard;
  completed_by: OrgAccountCard | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface OrgCareTaskPage {
  items: OrgCareTask[];
  limit: number;
}

export interface OrgClientBilling {
  subscriptions: OrgClientSubscription[];
  payments: OrgClientPayment[];
  contracts: OrgClientBillingContract[];
}

export interface OrgClientBillingContract {
  contract_id: string;
  status: string;
  price: number;
  cycle: string | null;
  started_at: string;
  past_due_since: string | null;
  grace_ends_at: string | null;
  offering_name: string;
}

export interface OrgClientCommercial {
  content: OrgClientContent[];
  orders: OrgClientOrder[];
  billing: OrgClientBilling;
  activities: OrgClientCommercialActivity[];
}

export interface OrgClientCommercialActivity {
  id: string;
  kind: string;
  occurred_at: string;
  offering_name: string | null;
}

export interface OrgClientConsentTrailEvent {
  id: string;
  event_type: "contract_opened" | "access_requested" | "access_granted" | "access_denied" | "access_revoked" | "access_expired" | "consent_allow" | "consent_deny" | "consent_revoke" | "contract_ended";
  scope: ("training" | "diet" | "protocols" | "health")[];
  occurred_at: string;
  documents: OrgMyAccessDocument[];
  reason: string | null;
  offering_name: string | null;
}

export interface OrgClientContent {
  entitlement_id: string;
  entitlement_status: "active" | "ended";
  granted_at: string | null;
  offering_name: string;
  offering_type: string;
  course_title: string;
  total_lessons: number | null;
  completed_lessons: number | null;
  completed_percent: number | null;
  last_opened_at: string | null;
  course_completed_at: string | null;
}

export interface OrgClientOrder {
  order_id: string;
  offering_id: string;
  item_title: string;
  quantity: number;
  status: string;
  shipping_method: string | null;
  delivery_expected_at: string | null;
  shipped_at: string | null;
  fulfilled_at: string | null;
  refunded_at: string | null;
  created_at: string;
}

export interface OrgClientPayment {
  transaction_id: string;
  status: string;
  gross_value: number;
  professional_net: number;
  payment_method: string;
  confirmed_at: string | null;
  created_at: string;
  offering_name: string;
}

export interface OrgClientSubscription {
  subscription_id: string;
  status: string;
  value: number;
  cycle: string | null;
  next_due_date: string | null;
  canceled_at: string | null;
  offering_name: string;
}

export interface OrgCrmAccess {
  view: boolean;
  edit: boolean;
}

export interface OrgCrmAccessMap {
  training: OrgCrmAccess;
  diet: OrgCrmAccess;
  protocols: OrgCrmAccess;
  health: OrgCrmAccess;
  photos: OrgCrmAccess;
}

export interface OrgCrmActiveProgram {
  id: string;
  title: string;
  alias: string | null;
  status: "draft" | "released" | "hidden";
  starts_at: string;
  ends_at: string;
}

export interface OrgCrmAdditionalAccess {
  granted: ("training" | "diet" | "protocols" | "health")[];
  requested: ("training" | "diet" | "protocols" | "health")[];
}

export interface OrgCrmBusinessCard {
  id: string;
  name: string;
}

export interface OrgCrmBusinessContext {
  id: string;
  name: string;
}

export interface OrgCrmCapabilities {
  messaging: "available";
  training: "available" | "needs_consent" | "pending_request";
  diet: "available" | "needs_consent" | "pending_request";
  protocols: "available" | "needs_consent" | "pending_request";
  health: "available" | "needs_consent" | "pending_request";
  photos: "available" | "absent";
  reports: "available" | "absent";
  content: "available" | "absent";
  orders: "available" | "absent";
  billing: "available" | "absent";
}

export interface OrgCrmClientCard {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  lifecycle: "lead" | "customer" | "former";
  active_subscriptions: number;
  subscription_status: "active" | "past_due" | null;
  pending_first_contact: boolean;
  last_activity_at: string;
  pending_first_contact_since: string | null;
  businesses: OrgCrmBusinessCard[];
  offerings: string[];
  tags: string[];
  commercial: OrgCrmCommercialSummary | null;
  training: OrgCrmTrainingSummary;
}

export interface OrgCrmClientIdentity {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface OrgCrmClientsResult {
  items: OrgCrmClientCard[];
  next_cursor: string | null;
}

export interface OrgCrmCommercialSummary {
  contract_id: string;
  business_id: string;
  offering_name: string;
  price: number;
  currency: string;
  billing_type: "free" | "one_time" | "recurring";
  billing_interval: string | null;
  status: "active" | "past_due" | "ended";
  past_due_since: string | null;
  grace_ends_at: string | null;
}

export interface OrgCrmConsultancyContext {
  contract_id: string;
  business_id: string;
  offering_id: string;
  offering_name: string;
  started_at: string;
  version: number;
  tools: ("training" | "diet" | "protocols" | "health")[];
}

export interface OrgCrmOverview {
  customers: number;
  active_subscribers: number;
  leads: number;
  pending_first_contact: number;
}

export interface OrgCrmPending {
  kind: "first_contact" | "unanswered_message" | "no_training_assigned";
  since: string;
}

export interface OrgCrmRelation {
  kind: "consultancy" | "entitlement" | "physical_order" | "subscription";
  id: string;
  offering_id: string;
  offering_type: string;
  offering_name: string;
  organization_id: string;
  status: "active" | "past_due" | "ended" | "pending" | "confirmed" | "failed" | "cancelled" | "refunded";
  started_at: string | null;
  ended_at: string | null;
  version: number;
}

export interface OrgCrmState {
  lifecycle: "lead" | "customer" | "former";
  tags: string[];
  notes: string | null;
  next_action_at: string | null;
  subscription_status: "active" | "past_due" | null;
  customer_since: string | null;
  last_purchase_at: string | null;
  last_activity_at: string | null;
  archived_at: string | null;
  version: number;
}

export interface OrgCrmTrainingPlan {
  has_active_cycle: boolean;
}

export interface OrgCrmTrainingSummary {
  active_program: OrgCrmActiveProgram | null;
  sessions_last_30_days: number;
  last_completed_at: string | null;
  days_inactive: number | null;
}

export interface OrgCrmWorkoutActivity {
  sessions_last_30_days: number;
  last_completed_at: string | null;
}

export interface OrgCrmWorkspace {
  client: OrgCrmClientIdentity;
  businesses: OrgCrmBusinessContext[];
  relations: OrgCrmRelation[];
  capabilities: OrgCrmCapabilities;
  pendings: OrgCrmPending[];
  crm: OrgCrmState;
  training_plan: OrgCrmTrainingPlan;
  access: OrgCrmAccessMap;
  workout_activity: OrgCrmWorkoutActivity | null;
  consultancy_contexts: OrgCrmConsultancyContext[];
  additional_access: OrgCrmAdditionalAccess;
}

export interface OrgMyAccess {
  requests: OrgMyAccessRequest[];
  grants: OrgMyAccessGrant[];
}

export interface OrgMyAccessBusiness {
  id: string;
  name: string;
  logo_url: string | null;
}

export interface OrgMyAccessDocument {
  key: string;
  kind?: string;
  title: string;
  url: string;
  version: string;
  acceptance_text: string;
}

export interface OrgMyAccessGrant {
  id: string;
  business: OrgMyAccessBusiness;
  requested_by: OrgAccountCard;
  team: OrgAccountCard[];
  items: ("training" | "diet" | "protocols" | "health")[];
  granted_at: string;
  version: number;
  document: OrgMyAccessDocument;
}

export interface OrgMyAccessRequest {
  id: string;
  business: OrgMyAccessBusiness;
  requested_by: OrgAccountCard;
  team: OrgAccountCard[];
  items: ("training" | "diet" | "protocols" | "health")[];
  message: string;
  requested_at: string;
  version: number;
  document: OrgMyAccessDocument;
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

export interface OwnConsultancyAccess {
  item: "training" | "diet" | "protocols" | "health";
  decision: "allowed" | "requested" | "denied" | "revoked";
  decided_at: string | null;
  decided_by?: string | null;
  requested_at?: string | null;
  reason?: string | null;
}

export interface OwnConsultancyBusiness {
  id: string;
  name: string;
  logo_url: string | null;
}

export interface OwnConsultancyConsentDocument {
  key: string;
  kind: string;
  title: string;
  url: string;
  version: string;
  acceptance_text: string;
}

export interface OwnConsultancyConsentEvent {
  event_type: "allowed";
  items: ("training" | "diet" | "protocols" | "health")[];
  occurred_at: string;
  documents: OwnConsultancyConsentDocument[];
}

export interface OwnConsultancyContract {
  id: string;
  version: number;
  status: "active" | "past_due" | "ended";
  started_at: string;
  ended_at: string | null;
  end_reason: string | null;
  subscription_id: string | null;
  past_due_since: string | null;
  grace_ends_at: string | null;
  next_due_date: string | null;
  can_recover_payment: boolean;
  cancellation_status: "pending" | "failed" | "canceled" | null;
  business: OwnConsultancyBusiness;
  offer: OwnConsultancyOffer;
  professional: OwnConsultancyProfessional;
  access: OwnConsultancyAccess[];
  accepted_at: string | null;
  consent_history: OwnConsultancyConsentEvent[];
}

export interface OwnConsultancyOffer {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: string | null;
}

export interface OwnConsultancyProfessional {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_professional: boolean;
}

export interface PaymentChannel {
  id: string;
  name_key: string;
  provider: string;
}

export interface ProductCategory {
  id: string;
  name_key: string;
  label: string;
  icon: string;
}

export interface ProfessionalCredential {
  account_id: string;
  specialty: string;
  specialty_label: string;
  council: string;
  jurisdiction: string;
  registration: string;
  display: string;
}

export interface ProfessionalExerciseRef {
  id: string;
  name: string;
  kind: "exercise" | "technique";
  video_url: string | null;
  thumb_url: string | null;
}

export interface ProfessionalSettings {
  specialty: string | null;
  specialty_label: string | null;
  council: string | null;
  jurisdiction: string | null;
  registration: string | null;
  status: "pending" | "approved" | "rejected" | null;
  rejection_reason: string | null;
}

export interface ProfessionalShowcase {
  is_owner: boolean;
  has_content: boolean;
  categories: ProfessionalShowcaseCategory[];
  challenges: SocialShowcaseGroup[];
  communities: SocialShowcaseGroup[];
}

export interface ProfessionalShowcaseCategory {
  slug: string;
  name: string;
  icon?: string | null;
  items: ProfessionalShowcaseItem[];
}

export interface ProfessionalShowcaseConfig {
  category_order: string[];
  featured_offering_id: string | null;
}

export interface ProfessionalShowcaseItem {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  currency: string;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval?: string | null;
  cover_url?: string | null;
  stock_available?: number | null;
  sold_out: boolean;
  featured: boolean;
  owned: boolean;
  owner_net?: number | null;
}

export interface ProfessionalSpecialty {
  id: string;
  name_key: string;
  label: string;
  council: string;
  regulated: boolean;
}

export interface ProfessionalWorkoutDetail {
  id: string;
  title: string;
  alias: string | null;
  sport_id: string;
  notes: string;
  steps: ProfessionalWorkoutStep[];
}

export interface ProfessionalWorkoutStep {
  id: string;
  position: number;
  title: string;
  exercise: ProfessionalExerciseRef | null;
  prescription: WorkoutPrescription;
}

export interface ProfessionalWorkoutStepSaveInput {
  id?: string;
  exercise_id?: string | null;
  title: string;
  prescription: WorkoutPrescription;
}

export interface ProfessionalWorkoutTemplate {
  id: string;
  kind: "template";
  business_id: string;
  title: string;
  sport_id: string;
  notes: string;
  steps: ProfessionalWorkoutStep[];
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramSummary {
  id: string;
  title: string;
  description: string;
  estimated_minutes_per_week: number | null;
  equipment: string[];
  sport_id: string;
  weeks: number;
  weekly_sessions: number;
  origin: string;
  active_application: string | null;
}

export interface ProtocolTemplate {
  id: string;
  flow: "generic" | "water" | "supplement";
  icon_key: "sparkles" | "droplets" | "glass-water" | "pill" | "moon" | "bed" | "timer" | "alarm-clock" | "heart-pulse" | "scan-heart" | "hand-heart" | "brain" | "target" | "leaf" | "flower-2" | "flame" | "waves" | "wind" | "sun" | "activity" | "dumbbell" | "bike" | "apple" | "salad" | "stethoscope" | "smile" | "notebook-pen";
  translations: ProtocolTemplateTranslation[];
  structure_locked: boolean;
  clinical_notice: boolean;
  featured: boolean;
  default_steps: ProtocolTemplateStep[];
}

export interface ProtocolTemplateStep {
  translations: ProtocolTemplateStepTranslation[];
  time: string | null;
  duration_minutes: number | null;
}

export interface ProtocolTemplateStepTranslation {
  locale: "pt-BR" | "pt-PT" | "en";
  name: string;
  instruction?: string | null;
}

export interface ProtocolTemplateTranslation {
  locale: "pt-BR" | "pt-PT" | "en";
  name: string;
  category: string;
  description: string;
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
  status: "active" | "paused" | "ended";
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
  origin: "personal" | "official" | "professional" | "purchase" | "program" | "day";
  professional: AccountCard | null;
  editable: boolean;
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
  /** Resultados por identificador de passo. */
  steps_done: TrainingStepActualMap;
  /** Avaliação depois do treino (sensação, notas). */
  review: TrainingSessionReview | null;
  /** Resultados por identificador de passo. */
  suggestions: TrainingStepActualMap;
}

/** Conclusão completa/parcial, duração, calorias, sensação, notas e parciais; a avaliação pode vir depois de encerrar. */
export interface SessionReviewInput {
  completion?: "full" | "partial";
  duration_seconds?: number;
  calories?: number;
  feeling?: string;
  notes?: string;
  /** Parciais nomeadas com valores escalares, sem documentos arbitrários aninhados. */
  partials?: TrainingScalarMap;
}

export interface SessionSetActual {
  index: number;
  completed: boolean;
  /** Identidade do exercício interno no snapshot do bloco composicional. */
  execution_item_id?: string;
  reps?: number;
  load?: SessionSetLoad;
}

export interface SessionSetLoad {
  value: number;
  unit: "kg" | "lb";
}

/** Resultado fechado e tipado do passo, incluindo conclusão parcial, séries, repetições e carga. */
export interface SessionStepActual {
  completion?: "full" | "partial";
  sets?: SessionSetActual[];
  duration_seconds?: number;
  distance_m?: number;
}

export interface SessionStepInput {
  step_id: string;
  /** Resultado fechado e tipado do passo, incluindo conclusão parcial, séries, repetições e carga. */
  actual: SessionStepActual;
}

export interface SessionSummary {
  id: string;
  status: "in_progress" | "completed";
  started_at: string;
  completed_at: string | null;
}

export interface SessionType {
  id: string;
  name_key: string;
  label: string;
  icon_key: string;
  sports: string[];
}

export interface SocialActivityShareInput {
  type: "activity";
  activity_id: string;
  show_route: boolean;
}

export type SocialChallengeActionCommand = SocialChallengePublish | SocialChallengeCancel | SocialChallengeEnd | SocialChallengeJoin | SocialChallengeLeave | SocialChallengeApprove | SocialChallengeReject | SocialChallengeBan | SocialChallengeContest;

export interface SocialChallengeApprove {
  action: "approve";
  id: string;
  target_id: string;
  idempotency_key: string;
}

export interface SocialChallengeBan {
  action: "ban";
  id: string;
  target_id: string;
  idempotency_key: string;
}

export interface SocialChallengeCancel {
  action: "cancel";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialChallengeCard {
  id: string;
  name: string;
  image_url: string | null;
  starts_at: string;
  ends_at: string;
  metric: string;
  members_only: boolean;
  participants: number;
  status: string;
  phase: "draft" | "upcoming" | "running" | "provisional" | "final" | "cancelled";
  joined: boolean;
}

export interface SocialChallengeCheckinRule {
  photo_required: boolean;
}

export interface SocialChallengeContest {
  action: "contest";
  id: string;
  reason: string;
  idempotency_key: string;
}

export interface SocialChallengeCreate {
  action: "create";
  idempotency_key: string;
  business_id?: string | null;
  community_id?: string | null;
  offer_id?: string | null;
  name: string;
  description: string;
  image_url?: string | null;
  visibility?: "listed" | "hidden";
  access_mode: "open" | "approval" | "invite" | "paid" | "inherited";
  publishing?: "admins" | "team" | "members";
  starts_at: string;
  ends_at: string;
  publish: boolean;
  accept_prize_responsibility?: boolean;
  config: SocialGroupConfig;
}

export interface SocialChallengeEnd {
  action: "end";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialChallengeJoin {
  action: "join";
  id: string;
  idempotency_key: string;
}

export interface SocialChallengeLeave {
  action: "leave";
  id: string;
  idempotency_key: string;
}

export interface SocialChallengeProgress {
  value: number;
  streak: number;
  active_days: number;
  activities: number;
  counted_today: boolean;
  position: number | null;
  contest: "none" | "open" | "resolved";
}

export interface SocialChallengePublish {
  action: "publish";
  id: string;
  expected_version: number;
  idempotency_key: string;
  accept_prize_responsibility: boolean;
}

export interface SocialChallengeRanking {
  metric: "active_days" | "streak" | "activities" | "calories" | "distance" | "minutes" | "steps" | "points";
  tiebreak: "streak" | "active_days";
  phase: "draft" | "upcoming" | "running" | "provisional" | "final" | "cancelled";
  day_index: number;
  day_total: number;
  total: number;
  me: SocialChallengeRankingRow | null;
  items: SocialChallengeRankingRow[];
  next_cursor: number | null;
}

export interface SocialChallengeRankingRow {
  position: number;
  profile: SocialProfileReadCard;
  value: number;
  streak: number;
}

export interface SocialChallengeReject {
  action: "reject";
  id: string;
  target_id: string;
  idempotency_key: string;
}

export type SocialChallengeSaveCommand = SocialChallengeCreate | SocialChallengeUpdate;

export interface SocialChallengeSportPoints {
  sport: string;
  points: number;
}

export interface SocialChallengeUpdate {
  action: "update";
  id: string;
  expected_version: number;
  idempotency_key: string;
  business_id?: string | null;
  community_id?: string | null;
  offer_id?: string | null;
  name: string;
  description: string;
  image_url?: string | null;
  visibility?: "listed" | "hidden";
  access_mode: "open" | "approval" | "invite" | "paid" | "inherited";
  publishing?: "admins" | "team" | "members";
  starts_at: string;
  ends_at: string;
  publish: boolean;
  accept_prize_responsibility?: boolean;
  config: SocialGroupConfig;
}

export interface SocialChallenges {
  items: SocialGroup[];
  next_cursor: string | null;
}

export interface SocialCheckinActivity {
  activity_id: string;
  available: boolean;
  sport: string | null;
  title: string | null;
  distance_m: number | null;
  duration_s: number | null;
  pace_s_per_km: number | null;
  calories: number | null;
  source: "app" | "watch" | "health" | "manual" | null;
  provider: string | null;
  route_shape: SocialRoutePoint[] | null;
}

export interface SocialCheckinInput {
  type: "checkin";
  title?: string | null;
  sport?: string | null;
  activity_id?: string | null;
}

export interface SocialCommunities {
  items: SocialGroup[];
  next_cursor: string | null;
}

export type SocialCommunityActionCommand = SocialCommunityPublish | SocialCommunityPauseEntry | SocialCommunityResumeEntry | SocialCommunityArchive | SocialCommunityJoin | SocialCommunityLeave | SocialCommunityApprove | SocialCommunityReject | SocialCommunityBan | SocialCommunityPinPost | SocialCommunityUnpinPost | SocialCommunitySetPreview | SocialCommunityClearPreview;

export interface SocialCommunityAgenda {
  items: SocialPost[];
  next_cursor: string | null;
}

export interface SocialCommunityApprove {
  action: "approve";
  id: string;
  target_id: string;
  idempotency_key: string;
}

export interface SocialCommunityArchive {
  action: "archive";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialCommunityBan {
  action: "ban";
  id: string;
  target_id: string;
  idempotency_key: string;
}

export interface SocialCommunityClearPreview {
  action: "clearPreview";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialCommunityCreate {
  action: "create";
  idempotency_key: string;
  business_id?: string | null;
  offer_id?: string | null;
  name: string;
  description: string;
  image_url?: string | null;
  visibility?: "listed" | "hidden";
  access_mode: "open" | "approval" | "invite" | "paid" | "club";
  publishing?: "admins" | "team" | "members";
  publish: boolean;
  config: SocialGroupConfig;
}

export interface SocialCommunityJoin {
  action: "join";
  id: string;
  idempotency_key: string;
}

export interface SocialCommunityLeave {
  action: "leave";
  id: string;
  idempotency_key: string;
}

export interface SocialCommunityLibrary {
  items: SocialPost[];
  next_cursor: string | null;
}

export interface SocialCommunityPauseEntry {
  action: "pauseEntry";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialCommunityPinPost {
  action: "pinPost";
  id: string;
  post_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialCommunityPoints {
  total: number;
  month: string;
  month_points: number;
  level: number;
  level_floor: number;
  next_level_at: number;
}

export interface SocialCommunityPublish {
  action: "publish";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialCommunityRanking {
  month: string;
  total: number;
  me: SocialCommunityRankingRow | null;
  items: SocialCommunityRankingRow[];
  next_cursor: number | null;
}

export interface SocialCommunityRankingRow {
  position: number;
  profile: SocialProfileReadCard;
  month_points: number;
  level: number;
}

export interface SocialCommunityReject {
  action: "reject";
  id: string;
  target_id: string;
  idempotency_key: string;
}

export interface SocialCommunityResumeEntry {
  action: "resumeEntry";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export type SocialCommunitySaveCommand = SocialCommunityCreate | SocialCommunityUpdate;

export interface SocialCommunitySetPreview {
  action: "setPreview";
  id: string;
  post_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialCommunityUnpinPost {
  action: "unpinPost";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialCommunityUpdate {
  action: "update";
  id: string;
  expected_version: number;
  idempotency_key: string;
  business_id?: string | null;
  offer_id?: string | null;
  name: string;
  description: string;
  image_url?: string | null;
  visibility?: "listed" | "hidden";
  access_mode: "open" | "approval" | "invite" | "paid" | "club";
  publishing?: "admins" | "team" | "members";
  publish: boolean;
  config: SocialGroupConfig;
}

export interface SocialConversation {
  peer: SocialProfileReadCard;
  items: SocialMessage[];
  next_cursor: string | null;
}

export interface SocialConversationSummary {
  peer: SocialProfileReadCard;
  last_message: SocialMessage;
  unread: number;
  hired_professional: boolean;
  client: boolean;
  lead: boolean;
  connection: boolean;
}

export interface SocialEventInput {
  type: "event";
  title: string;
  starts_at: string;
  ends_at?: string | null;
  timezone: string;
  location?: string | null;
  online: boolean;
}

export interface SocialExplore {
  items: SocialPost[];
  people: SocialProfileReadCard[];
  next_cursor: string | null;
}

export interface SocialFeed {
  items: SocialPost[];
  stories: SocialPost[];
  next_cursor: string | null;
}

export interface SocialGroup {
  id: string;
  kind: "community" | "challenge";
  owner_id: string;
  business_id: string | null;
  community_id: string | null;
  offer_id: string | null;
  status: "draft" | "published" | "entry_paused" | "read_only" | "ended" | "cancelled" | "archived" | "suspended";
  name: string;
  description: string;
  image_url: string | null;
  visibility: "listed" | "hidden";
  access_mode: "open" | "approval" | "invite" | "paid" | "inherited" | "club";
  publishing: "admins" | "team" | "members";
  starts_at: string | null;
  ends_at: string | null;
  config: SocialGroupConfig;
  version: number;
  members: number;
  my_membership: SocialGroupMembership | null;
  owner?: SocialProfileReadCard;
  participants?: SocialGroupParticipant[];
  capabilities: SocialGroupCapabilities;
  offer?: SocialGroupOffer;
  phase?: "draft" | "upcoming" | "running" | "provisional" | "final" | "cancelled";
  provisional_ends_at?: string;
  community?: SocialGroupHost;
  pinned_post?: SocialPost;
  preview_post?: SocialPost;
}

export interface SocialGroupCapabilities {
  can_manage: boolean;
  can_edit: boolean;
  can_moderate: boolean;
  can_post_materials: boolean;
  can_publish: boolean;
}

export interface SocialGroupConfig {
  sports?: string[];
  category?: string;
  rules_text?: string;
  participant_limit?: number;
  completion_threshold?: number;
  metric?: "active_days" | "streak" | "activities" | "calories" | "distance" | "minutes" | "steps" | "points";
  prize?: SocialGroupPrize;
  spaces?: SocialGroupSpace[];
  pinned_post_id?: string;
  preview_post_id?: string;
  timezone?: string;
  template?: string;
  target?: number;
  points_by_sport?: SocialChallengeSportPoints[];
  checkin?: SocialChallengeCheckinRule;
}

export interface SocialGroupHost {
  id: string;
  name: string;
  image_url: string | null;
}

export interface SocialGroupMembership {
  access_level: "admin" | "editor" | "member";
  status: "invited" | "requested" | "active" | "archived" | "banned" | "left";
  score: number | null;
  streak: number | null;
  team: string | null;
  entitled?: boolean;
  points?: SocialCommunityPoints;
  progress?: SocialChallengeProgress;
}

export interface SocialGroupOffer {
  id: string;
  role: "sale" | "club";
  name: string;
  price: number | null;
  currency: string;
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: string | null;
  access_duration: string | null;
  status: "draft" | "ready" | "published" | "paused" | "archived";
}

export interface SocialGroupParticipant {
  account_id: string;
  access_level: "admin" | "editor" | "member";
  status: "active" | "requested";
  profile: SocialProfileReadCard;
}

export interface SocialGroupPrize {
  text: string;
  image_url?: string;
}

export interface SocialGroupSpace {
  id: string;
  name: string;
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
  conversations: SocialConversationSummary[];
  notifications: SocialNotification[];
  search_hits: SocialInboxSearchHit[];
  next_cursor: string | null;
  unread_count: number;
}

export interface SocialInboxSearchHit {
  result_kind: "person" | "message";
  peer: SocialProfileReadCard;
  message: SocialMessage;
}

export interface SocialInteractionAttend {
  action: "attend";
  target_id: string;
  account_id: string;
  idempotency_key: string;
}

export type SocialInteractionCommand = SocialInteractionLike | SocialInteractionUnlike | SocialInteractionDislike | SocialInteractionUndislike | SocialInteractionComment | SocialInteractionReply | SocialInteractionEdit | SocialInteractionDelete | SocialInteractionReport | SocialInteractionVote | SocialInteractionUnvote | SocialInteractionRsvp | SocialInteractionUnrsvp | SocialInteractionAttend | SocialInteractionUnattend;

export interface SocialInteractionComment {
  action: "comment";
  target_id: string;
  body: string;
  idempotency_key: string;
}

export interface SocialInteractionDelete {
  action: "delete";
  target_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialInteractionDislike {
  action: "dislike";
  target_id: string;
  idempotency_key: string;
}

export interface SocialInteractionEdit {
  action: "edit";
  target_id: string;
  body: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialInteractionLike {
  action: "like";
  target_id: string;
  idempotency_key: string;
}

export interface SocialInteractionReply {
  action: "reply";
  target_id: string;
  body: string;
  idempotency_key: string;
}

export interface SocialInteractionReport {
  action: "report";
  target_id: string;
  reason: string;
  description?: string | null;
  idempotency_key: string;
}

export interface SocialInteractionRsvp {
  action: "rsvp";
  target_id: string;
  idempotency_key: string;
}

export interface SocialInteractionUnattend {
  action: "unattend";
  target_id: string;
  account_id: string;
  idempotency_key: string;
}

export interface SocialInteractionUndislike {
  action: "undislike";
  target_id: string;
  idempotency_key: string;
}

export interface SocialInteractionUnlike {
  action: "unlike";
  target_id: string;
  idempotency_key: string;
}

export interface SocialInteractionUnrsvp {
  action: "unrsvp";
  target_id: string;
  idempotency_key: string;
}

export interface SocialInteractionUnvote {
  action: "unvote";
  target_id: string;
  idempotency_key: string;
}

export interface SocialInteractionVote {
  action: "vote";
  target_id: string;
  option_id: string;
  idempotency_key: string;
}

export interface SocialMedia {
  repeat_automatically?: boolean;
  file_id: string;
  kind: "image" | "video";
  url?: string;
  object_key?: string;
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
  blurhash?: string | null;
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
  blurhash?: string | null;
  framing?: SocialMediaFramingInput | null;
  text_overlays: SocialTextOverlayInput[];
  image_overlay?: SocialImageOverlayInput | null;
  user_tags: SocialUserTagInput[];
}

export interface SocialMediaPreview {
  kind: "image" | "video";
  aspect_ratio: number | null;
  blurhash: string | null;
}

export interface SocialMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string | null;
  media_type: "image" | "video" | "audio" | "post" | "community_post" | null;
  media: SocialMessageMedia | null;
  shared_content: SocialSharedContent | null;
  read: boolean;
  created_at: string;
}

export interface SocialMessageActionData {
  type?: "text" | "image" | "video" | "audio" | "post" | "community_post" | null;
  body?: string | null;
  media?: SocialMessageMediaInput | null;
  shared_post_id?: string | null;
  idempotency_key?: string | null;
  peer_id?: string | null;
  id?: string | null;
}

export interface SocialMessageActionResult {
  messages: SocialMessage[];
  deleted_id: string | null;
  unread_count: number;
}

export interface SocialMessageMedia {
  file_id: string;
  kind: "image" | "video" | "audio";
  /** Anexo privado: URL obtida por social.messageMediaAccess, nunca persistida na mensagem. */
  url: string | null;
  mime: string;
  size: number;
  name: string | null;
  duration_ms: number | null;
  width: number | null;
  height: number | null;
  poster_url: string | null;
}

export interface SocialMessageMediaAccess {
  url: string;
  expires_in: number;
  filename: string;
  mime: string;
}

export interface SocialMessageMediaComplete {
  action: "complete";
  request_id: string;
  idempotency_key: string;
}

export interface SocialMessageMediaInput {
  file_id: string;
  kind: "image" | "video" | "audio";
  name?: string | null;
  duration_ms?: number | null;
  width?: number | null;
  height?: number | null;
}

export interface SocialMessageMediaPending {
  file_id: string;
  status: "pending";
  upload_url: string;
  upload_headers: SocialMessageMediaUploadHeaders;
  expires_in: number;
}

export interface SocialMessageMediaPrepare {
  action: "prepare";
  request_id: string;
  filename: string;
  mime: "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "image/avif" | "image/heic" | "image/heif" | "audio/webm" | "audio/mp4" | "audio/mpeg" | "audio/ogg" | "audio/aac" | "audio/wav" | "video/mp4" | "video/webm" | "video/quicktime";
  bytes: number;
}

export interface SocialMessageMediaReady {
  file_id: string;
  status: "ready";
  mime: string;
  bytes: number;
}

export type SocialMessageMediaUpload = SocialMessageMediaPending | SocialMessageMediaReady;

export interface SocialMessageMediaUploadHeaders {
  "Content-Type": string;
  "Content-Length": string;
}

export type SocialMessageMediaUploadInput = SocialMessageMediaPrepare | SocialMessageMediaComplete;

export interface SocialNetworkIdentity {
  classification: "professional" | "associate" | "ambassador";
  badge_label?: string | null;
  affinity_group_key?: string | null;
  headline?: string | null;
  public_visible: boolean;
}

export interface SocialNotification {
  id: string;
  kind: string;
  actor: SocialNotificationActor | null;
  intent: SocialNotificationIntent;
  data: SocialNotificationData;
  seen_at: string | null;
  read_at: string | null;
  created_at: string;
}

export interface SocialNotificationActor {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
}

export interface SocialNotificationData {
  message_id?: string | null;
  contract_id?: string | null;
  scheduled_id?: string | null;
  scope?: string | null;
  from_date?: string | null;
  access_id?: string | null;
  item?: "training" | "diet" | "protocols" | "health" | null;
  items?: ("training" | "diet" | "protocols" | "health")[] | null;
  decision?: "allowed" | "denied" | "revoked" | null;
}

export interface SocialNotificationIntent {
  type: "profile" | "post" | "story" | "comment" | "conversation" | "client" | "data_access" | "purchase";
  account_id?: string | null;
  post_id?: string | null;
  story_id?: string | null;
  comment_id?: string | null;
  reply_id?: string | null;
  peer_id?: string | null;
  member_id?: string | null;
  business_id?: string | null;
  contract_id?: string | null;
  purchase_id?: string | null;
}

export interface SocialPeople {
  items: SocialProfileReadCard[];
  total: number;
  next_cursor: string | null;
}

export interface SocialPollInput {
  type: "poll";
  question: string;
  options: string[];
  closes_at?: string | null;
}

export interface SocialPollOption {
  id: string;
  label: string;
  votes: number;
}

export interface SocialPost {
  id: string;
  kind: "post" | "story" | "comment";
  author: SocialProfileReadCard;
  parent_id?: string | null;
  container_type?: "community" | "challenge" | null;
  container_id?: string | null;
  recipient_id?: string | null;
  expires_at?: string | null;
  status: "draft" | "pending" | "published" | "removed";
  visibility: "public" | "followers" | "members" | "paid" | "private";
  body: string;
  content?: SocialPostContent;
  media: SocialMedia[];
  sports: string[];
  location?: string | null;
  offer_id?: string | null;
  affinity?: string | null;
  comments_enabled: boolean;
  like_count: number;
  comment_count: number;
  view_count: number;
  save_count: number;
  viewed?: boolean | null;
  liked: boolean;
  saved: boolean;
  my_reaction: "like" | "dislike" | null;
  version: number;
  created_at: string;
  updated_at: string;
  space_id?: string | null;
  attachment?: SocialPostAttachment;
  club?: SocialPostClub;
  author_club_member?: boolean;
}

export type SocialPostActionCommand = SocialPostCaptionAction | SocialPostCommentsAction | SocialPostCoverAction | SocialPostDeleteAction | SocialPostCancelEventAction | SocialPostModerateAction | SocialPostApproveCheckinAction | SocialPostRejectCheckinAction;

export interface SocialPostActivity {
  type: "activity";
  activity_id: string;
  available: boolean;
  sport: string | null;
  title: string | null;
  distance_m: number | null;
  duration_s: number | null;
  pace_s_per_km: number | null;
  calories: number | null;
  source: "app" | "watch" | "health" | "manual" | null;
  provider: string | null;
  route_shape: SocialRoutePoint[] | null;
}

export interface SocialPostApproveCheckinAction {
  action: "approveCheckin";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export type SocialPostAttachment = SocialPostEvent | SocialPostPoll | SocialPostResource | SocialPostActivity | SocialPostChallengeRef | SocialPostCheckin;

export type SocialPostAttachmentInput = SocialEventInput | SocialPollInput | SocialResourceInput | SocialActivityShareInput | SocialCheckinInput;

export interface SocialPostCancelEventAction {
  action: "cancelEvent";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialPostCaptionAction {
  action: "updateCaption";
  id: string;
  body: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialPostChallengeRef {
  type: "challenge";
  challenge: SocialChallengeCard;
}

export interface SocialPostCheckin {
  type: "checkin";
  title: string | null;
  sport: string | null;
  activity: SocialCheckinActivity | null;
  review: "pending" | "counted";
}

export interface SocialPostClub {
  offer_id: string;
  name: string;
  price: number | null;
  currency: string;
  billing_interval: string | null;
  subscribed: boolean;
  locked: boolean;
  previews: SocialMediaPreview[];
}

export interface SocialPostCommentsAction {
  action: "setCommentsEnabled";
  id: string;
  enabled: boolean;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialPostContent {
  media?: SocialMediaInput[];
  sports?: string[];
  location?: string | null;
  offer_id?: string | null;
  reply_to?: string | null;
  duration_seconds?: number | null;
}

export interface SocialPostCoverAction {
  action: "setCover";
  id: string;
  media_position: number;
  cover_file_id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialPostCreate {
  action: "create";
  idempotency_key: string;
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
  space_id?: string | null;
  attachment?: SocialPostAttachmentInput;
}

export interface SocialPostDeleteAction {
  action: "delete";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialPostEvent {
  type: "event";
  title: string;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  location: string | null;
  online: boolean;
  cancelled: boolean;
  going_count: number;
  going: SocialProfileReadCard[];
  attended_count: number;
  my_rsvp: boolean;
  my_attended: boolean;
}

export interface SocialPostLookup {
  found: boolean;
  id?: string | null;
}

export interface SocialPostModerateAction {
  action: "moderate";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialPostPoll {
  type: "poll";
  question: string;
  options: SocialPollOption[];
  total_votes: number;
  my_vote: string | null;
  closes_at: string | null;
  closed: boolean;
}

export interface SocialPostRejectCheckinAction {
  action: "rejectCheckin";
  id: string;
  expected_version: number;
  idempotency_key: string;
}

export interface SocialPostResource {
  type: "resource";
  title: string;
  description: string;
  file_id: string;
  filename: string;
  mime: string;
  bytes: number;
}

export type SocialPostSaveCommand = SocialPostCreate | SocialPostUpdate;

export interface SocialPostUpdate {
  action: "update";
  id: string;
  expected_version: number;
  idempotency_key: string;
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
  space_id?: string | null;
  attachment?: SocialPostAttachmentInput;
}

export interface SocialPosts {
  items: SocialPost[];
}

export interface SocialProfile {
  profile: SocialProfileReadCard;
  posts: SocialPost[];
  stories: SocialPost[];
  next_cursor: string | null;
}

export interface SocialProfileActionData {
  reason?: "spam" | "harassment" | "hate" | "nudity" | "violence" | "fraud" | "other" | null;
  description?: string | null;
}

export interface SocialProfileActionResult {
  account_id: string;
  reported: boolean;
}

export interface SocialProfileReadCard {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  social_links?: IdentitySocialLinks;
  is_professional: boolean;
  following: boolean;
  followed_by: boolean;
  subscribed: boolean;
  follower_count: number;
  following_count: number;
  subscriber_count: number;
  post_count: number;
  network_identity?: SocialNetworkIdentity | null;
}

export interface SocialProfileRelation {
  account_id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  is_professional: boolean;
  blocked_by_me: boolean;
  blocked_me: boolean;
}

export interface SocialPublicationPolicy {
  video_seconds: number;
  story_seconds: number;
  total_video_seconds: number;
  media_count: number;
  ambassador: boolean;
}

export interface SocialRelationState {
  account_id: string;
  following: boolean;
  followed_by: boolean;
  blocked_by_me: boolean;
}

export interface SocialReportResult {
  target_type: string;
  target_id: string;
  reported: boolean;
}

export interface SocialResourceAccess {
  url: string;
  expires_in: number;
  filename: string;
  mime: string;
}

export interface SocialResourceComplete {
  action: "complete";
  request_id: string;
  community_id: string;
  idempotency_key: string;
}

export interface SocialResourceInput {
  type: "resource";
  title: string;
  description?: string | null;
  file_id: string;
}

export interface SocialResourcePending {
  file_id: string;
  status: "pending";
  upload_url: string;
  upload_headers: SocialResourceUploadHeaders;
  expires_in: number;
}

export interface SocialResourcePrepare {
  action: "prepare";
  request_id: string;
  community_id: string;
  filename: string;
  mime: "application/pdf" | "video/mp4" | "video/webm" | "audio/mpeg" | "audio/mp4" | "image/jpeg" | "image/png" | "image/webp";
  bytes: number;
}

export interface SocialResourceReady {
  file_id: string;
  status: "ready";
  mime: string;
  bytes: number;
}

export type SocialResourceUpload = SocialResourcePending | SocialResourceReady;

export interface SocialResourceUploadHeaders {
  "Content-Type": string;
  "Content-Length": string;
}

export type SocialResourceUploadInput = SocialResourcePrepare | SocialResourceComplete;

export interface SocialRoutePoint {
  x: number;
  y: number;
}

export interface SocialSharedContent {
  available: boolean;
  kind: "post" | "community_post" | null;
  id: string | null;
  container_id: string | null;
  title: string | null;
  author_id: string | null;
  author_name: string | null;
  author_username: string | null;
  author_avatar_url: string | null;
  author_network_classification: "professional" | "associate" | "ambassador" | null;
  author_badge_label: string | null;
  author_affinity_group_key: string | null;
  body: string | null;
  thumbnail_url: string | null;
  media_kind: "image" | "video" | null;
  media_aspect_ratio: number | null;
  has_access: boolean;
}

export interface SocialShowcaseGroup {
  id: string;
  name: string;
  description: string;
  image_url?: string | null;
  visibility: "listed" | "hidden";
  members: number;
}

export interface SocialStories {
  items: SocialPost[];
  next_cursor: string | null;
}

export interface SocialStoryActionData {
  enabled?: boolean | null;
  post_id?: string | null;
}

export interface SocialStoryActionResult {
  action: "view" | "setCommentsEnabled" | "convertToPost" | "delete";
  items: SocialPost[];
}

export interface SocialStoryInput {
  id?: string | null;
  idempotency_key?: string | null;
  visibility: "public" | "followers" | "paid";
  body: string;
  media: SocialMediaInput;
  comments_enabled: boolean;
}

export interface SocialTextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  font: "modern" | "strong" | "classic" | "typewriter";
  color: number;
  background: "none" | "translucent" | "solid";
  background_color: number | null;
  background_opacity: number | null;
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
  engine: "strength" | "endurance" | "crossfit" | "hyrox" | "combat" | "compositional";
  affinity_group_id: string | null;
}

export interface StaffAccount {
  account: StaffAccountDetail;
  businesses: StaffAccountBusiness[];
  purchases: StaffAccountPurchase[];
  mail: StaffAccountMail[];
}

export interface StaffAccountBusiness {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export type StaffAccountCommand = StaffAccountSetRoleCommand | StaffAccountRemoveCommand;

export interface StaffAccountDetail {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  country_code: string | null;
  document_last4: string | null;
  is_professional: boolean;
  staff_role: "super_admin" | "admin" | "operator" | null;
  staff_since: string | null;
  staff_created_by: string | null;
  created_at: string;
  bio: string;
  onboarded_at: string | null;
  access_granted_at: string | null;
}

export interface StaffAccountMail {
  id: string;
  subject: string;
  status: string;
  last_message_at: string;
}

export interface StaffAccountPurchase {
  id: string;
  offer_name: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
}

export interface StaffAccountRemoveCommand {
  action: "removeFromStaff";
  expected_role: "super_admin" | "admin" | "operator" | null;
  idempotency_key: string;
}

export interface StaffAccountSetRoleCommand {
  action: "setStaffRole";
  role: "super_admin" | "admin" | "operator";
  expected_role: "super_admin" | "admin" | "operator" | null;
  idempotency_key: string;
}

export interface StaffAccountSummary {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  country_code: string | null;
  document_last4: string | null;
  is_professional: boolean;
  staff_role: "super_admin" | "admin" | "operator" | null;
  staff_since: string | null;
  staff_created_by: string | null;
  created_at: string;
}

export interface StaffAccounts {
  items: StaffAccountSummary[];
  next_cursor: string | null;
}

export interface StaffAffinityGroupData {
  label: string;
  icon: string;
  accent: string;
  aliases: string[];
}

export interface StaffAffinityGroupDataInput {
  icon: string;
  accent: string;
  aliases: string[];
}

export interface StaffAffinityGroupItem {
  kind: "affinity_groups";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffAffinityGroupData;
  impact: StaffCatalogImpact;
}

export interface StaffAffinityGroupSave {
  kind: "affinity_groups";
  key: string;
  label: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffAffinityGroupDataInput;
}

export interface StaffAmbassadorAffinity {
  key: string;
  label: string;
  active: boolean;
  sort_order: number;
}

export interface StaffAmbassadorAuditEntry {
  id: number;
  actor_id: string | null;
  action: string;
  target_type: string;
  target_id: string;
  at: string;
}

export interface StaffAmbassadorCandidate {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  follower_count: number;
  professional_vertical: string;
  has_open_membership: boolean;
}

export interface StaffAmbassadorMembership {
  id: string;
  account_id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  follower_count: number;
  classification: "principal" | "associate" | "professional";
  affinity_group_key: string;
  affinity_group_label: string;
  region_id: string | null;
  region_name: string | null;
  country_code: string | null;
  state_code: string | null;
  city_name: string | null;
  principal_membership_id: string | null;
  principal_name: string | null;
  status: string;
  public_visible: boolean;
  display_order: number;
  headline: string | null;
  contract_reference: string | null;
  starts_at: string | null;
  ends_at: string | null;
  version: number;
  active_associates: number;
  current_memberships: number;
  pending_requests: number;
  created_at: string;
  updated_at: string;
}

export interface StaffAmbassadorNetwork {
  program: StaffAmbassadorProgram;
  affinity_groups: StaffAmbassadorAffinity[];
  regions: StaffAmbassadorRegion[];
  policies: StaffAmbassadorPolicy[];
  assignments: StaffAmbassadorMembership[];
  next_cursor: string | null;
  total: number;
  requests: StaffAmbassadorMembership[];
  candidates: StaffAmbassadorCandidate[];
  audit: StaffAmbassadorAuditEntry[];
}

export interface StaffAmbassadorNetworkActionData {
  expected_version?: number;
  name?: string;
  slug?: string;
  scope_type?: "global" | "country" | "state" | "city" | "custom";
  country_code?: string | null;
  state_code?: string | null;
  city_name?: string | null;
  parent_id?: string | null;
  specificity?: number;
  priority?: number;
  active?: boolean;
  affinity_group_key?: string;
  region_id?: string | null;
  follower_threshold?: number;
  manual_choice_enabled?: boolean;
  automatic_principal_enabled?: boolean;
  published?: boolean;
  network_enabled?: boolean;
  onboarding_enabled?: boolean;
  allow_direct?: boolean;
  account_id?: string;
  classification?: "principal" | "associate";
  principal_membership_id?: string | null;
  public_visible?: boolean;
  display_order?: number;
  headline?: string | null;
  contract_reference?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  transition?: "submit" | "activate" | "suspend" | "end" | "reactivate";
  decision?: "approve" | "reject";
  reason?: string;
}

export interface StaffAmbassadorNetworkActionResult {
  action: "saveRegion" | "setRegionActive" | "savePolicy" | "setProgram" | "saveAssignment" | "transitionAssignment" | "transferAssociate" | "decideRequest" | "transferRequest";
  region?: StaffAmbassadorRegion;
  policy?: StaffAmbassadorPolicy;
  program?: StaffAmbassadorProgramActionResult;
  membership?: StaffAmbassadorMembership;
}

export interface StaffAmbassadorPolicy {
  id: string;
  affinity_group_key: string;
  region_id: string | null;
  follower_threshold: number;
  manual_choice_enabled: boolean;
  automatic_principal_enabled: boolean;
  published: boolean;
  version: number;
  updated_at: string;
}

export interface StaffAmbassadorProgram {
  network_enabled: boolean;
  onboarding_enabled: boolean;
  allow_direct: boolean;
  version: number;
}

export interface StaffAmbassadorProgramActionResult {
  network_enabled: boolean;
  onboarding_enabled: boolean;
  allow_direct: boolean;
  version: number;
}

export interface StaffAmbassadorRegion {
  id: string;
  name: string;
  slug: string;
  scope_type: "global" | "country" | "state" | "city" | "custom";
  country_code: string | null;
  state_code: string | null;
  city_name: string | null;
  parent_id: string | null;
  specificity: number;
  priority: number;
  active: boolean;
  version: number;
  assignment_count: number;
  current_membership_count: number;
  created_at: string;
  updated_at: string;
}

export interface StaffAppStoreCatalogItem {
  enabled: boolean;
  offering: StaffAppStoreOffering;
  product: StaffAppStoreProduct | null;
  metadata: StaffAppStoreMetadata | null;
  state: "draft" | "prepared" | "syncing" | "ready" | "awaiting_app_version" | "published" | "blocked";
  apple_review_state: string | null;
  error_code: string | null;
  job: StaffAppStoreSyncJob | null;
  version: number;
}

export interface StaffAppStoreCatalogPage {
  items: StaffAppStoreCatalogItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface StaffAppStoreMetadata {
  display_name: string | null;
  description: string | null;
  review_notes: string | null;
  screenshot_file_id: string | null;
  locale: string;
  base_territory: string;
  available_territories: string[];
  available_in_new_territories: boolean;
}

export interface StaffAppStoreMetadataInput {
  display_name: string;
  description: string;
  review_notes: string;
  screenshot_file_id: string | null;
  locale: string;
  base_territory: string;
  available_territories: string[];
  available_in_new_territories: boolean;
}

export interface StaffAppStoreOffering {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  readiness: string;
  version: number;
}

export interface StaffAppStoreProduct {
  offer_id: string;
  channel: string;
  product_id: string;
  product_type: string;
  subscription_group_reference: string | null;
  price: number;
  currency: string;
  status: string;
  version: number;
}

export interface StaffAppStoreReconciliationBatch {
  id: string;
  period_start: string;
  period_end: string;
  status: "queued" | "processing" | "completed" | "failed";
  processed_rows: number;
  divergent_rows: number;
}

export interface StaffAppStoreReconciliationBatchPage {
  items: StaffAppStoreReconciliationBatch[];
  limit: number;
  offset: number;
}

export interface StaffAppStoreReconciliationLine {
  id: string;
  product_id: string;
  result: "matched" | "missing_internal" | "missing_external" | "amount_mismatch" | "ignored" | "pending";
  currency: string;
  gross_amount: number | null;
  proceeds_amount: number | null;
}

export interface StaffAppStoreReconciliationLinePage {
  items: StaffAppStoreReconciliationLine[];
  limit: number;
  offset: number;
}

export interface StaffAppStoreReviewComplete {
  action: "complete";
  request_id: string;
  idempotency_key: string;
}

export interface StaffAppStoreReviewPending {
  file_id: string;
  status: "pending";
  upload_url: string;
  upload_headers: StaffUploadHeaders;
  expires_in: number;
}

export interface StaffAppStoreReviewPrepare {
  action: "prepare";
  request_id: string;
  filename: string;
  mime: "image/png" | "image/jpeg";
  bytes: number;
}

export interface StaffAppStoreReviewReady {
  file_id: string;
  status: "ready";
}

export type StaffAppStoreReviewUploadCommand = StaffAppStoreReviewPrepare | StaffAppStoreReviewComplete;

export type StaffAppStoreReviewUploadResult = StaffAppStoreReviewPending | StaffAppStoreReviewReady;

export interface StaffAppStoreSyncJob {
  id: number;
  operation: string | null;
  state: string;
  error_code: string | null;
}

export interface StaffAppStoreTransaction {
  id: string;
  transaction_id: string;
  original_transaction_id: string;
  product_id: string | null;
  offering_id: string;
  offering_name: string | null;
  organization_id: string | null;
  organization_name: string | null;
  buyer_profile_id: string;
  buyer_name: string;
  professional_profile_id: string | null;
  professional_name: string;
  environment: "Production" | "Sandbox";
  status: "active" | "expired" | "revoked";
  has_access: boolean;
  purchase_date: string;
  expires_date: string | null;
  revoked_at: string | null;
  gross_value: number | null;
  currency: string | null;
  payment_transaction_id: string | null;
  provider_fee: number | null;
  platform_commission: number | null;
  professional_net: number | null;
  settlement_status: "pending" | "confirmed" | "settled" | "refunded" | "chargeback" | null;
}

export interface StaffAppStoreTransactionPage {
  total: number;
  limit: number;
  offset: number;
  items: StaffAppStoreTransaction[];
}

export interface StaffAudit {
  items: StaffAuditItem[];
  next_cursor: number | null;
}

export interface StaffAuditEventSummary {
  event: string;
  events_count: number;
  last_at: string;
}

export interface StaffAuditItem {
  id: number;
  at: string;
  actor_id: string | null;
  actor_role: "account" | "staff" | "system";
  action: string;
  target_type: string;
  target_id: string;
  /** Snapshot JSON anterior, ou null quando não existe. */
  before: JsonValue;
  /** Snapshot JSON posterior, ou null quando não existe. */
  after: JsonValue;
  /** Metadados JSON específicos do fato auditado. */
  data: JsonValue;
}

export interface StaffBetaFeedbackCounts {
  new: number;
  in_review: number;
  resolved: number;
  discarded: number;
}

export interface StaffBetaFeedbackItem {
  id: string;
  reporter_user_id: string;
  description: string;
  has_screenshot: boolean;
  route: string | null;
  app_version: string | null;
  build_number: string | null;
  platform: "ios" | "android";
  os_version: string | null;
  locale: string | null;
  viewport_width: number | null;
  viewport_height: number | null;
  status: "new" | "in_review" | "resolved" | "discarded";
  internal_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  version: number;
  full_name: string;
  username: string;
  avatar_url: string | null;
}

export interface StaffBetaFeedbackPage {
  items: StaffBetaFeedbackItem[];
  total: number;
  counts: StaffBetaFeedbackCounts;
}

export interface StaffBetaFeedbackScreenshot {
  url: string;
  expires_in: number;
}

export interface StaffBusinessNicheData {
  label: string;
}

export type StaffBusinessNicheDataInput = Record<string, never>;

export interface StaffBusinessNicheItem {
  kind: "business_niches";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffBusinessNicheData;
  impact: StaffCatalogImpact;
}

export interface StaffBusinessNicheSave {
  kind: "business_niches";
  key: string;
  label: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffBusinessNicheDataInput;
}

export interface StaffBusinessVerification {
  id: string;
  name: string;
  status: "pending_review" | "approved" | "rejected";
  verified: boolean;
  logo_url: string;
  description: string;
  company_document_last4: string | null;
  website_url: string | null;
  market_niche: string | null;
  market_niche_label: string | null;
  created_at: string;
  submitted_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  reviewed_by: StaffBusinessVerificationReviewer | null;
  owner: StaffBusinessVerificationOwner;
}

export interface StaffBusinessVerificationDecision {
  id: string;
  status: "draft" | "rejected";
  verified: boolean;
}

export interface StaffBusinessVerificationOwner {
  id: string;
  name: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
}

export interface StaffBusinessVerificationReviewer {
  id: string;
  name: string;
}

export interface StaffBusinessVerifications {
  items: StaffBusinessVerification[];
  total: number;
}

export interface StaffCatalog {
  kind: "affinity_groups" | "sports" | "session_types" | "fight_techniques" | "protocol_templates" | "business_niches" | "professional_specialties" | "product_categories" | "food_sources" | "nutrients" | "offer_types" | "payment_providers";
  can_edit: boolean;
  items: StaffCatalogItem[];
}

export interface StaffCatalogImpact {
  offers: number;
  accounts: number;
  professionals: number;
  approved_credentials: number;
  pending_credentials: number;
  total_links: number;
}

export type StaffCatalogItem = StaffAffinityGroupItem | StaffSportItem | StaffSessionTypeItem | StaffFightTechniqueItem | StaffProtocolTemplateItem | StaffBusinessNicheItem | StaffProfessionalSpecialtyItem | StaffProductCategoryItem | StaffOfferTypeItem | StaffPaymentProviderItem | StaffFoodSourceItem | StaffNutrientItem;

export interface StaffCatalogReordered {
  kind: "affinity_groups" | "sports" | "session_types" | "fight_techniques" | "protocol_templates" | "business_niches" | "professional_specialties" | "product_categories" | "food_sources" | "nutrients" | "offer_types";
  can_edit: boolean;
  items: StaffCatalogItem[];
}

export type StaffCatalogSaveItem = StaffAffinityGroupSave | StaffSportSave | StaffSessionTypeSave | StaffFightTechniqueSave | StaffProtocolTemplateSave | StaffBusinessNicheSave | StaffProfessionalSpecialtySave | StaffProductCategorySave | StaffOfferTypeSave | StaffPaymentProviderSave | StaffFoodSourceSave | StaffNutrientSave;

export interface StaffChallengeDispute {
  id: string;
  status: "open" | "in_review" | "resolved" | "rejected";
  reason: string;
  value: number;
  created_at: string;
  resolved_at: string | null;
  resolution_note: string | null;
  challenge: StaffDisputeChallenge;
  participant: StaffDisputeParticipant;
}

export interface StaffChallengeDisputes {
  items: StaffChallengeDispute[];
  total: number;
}

export interface StaffChannelCostPolicy {
  id: string;
  provider: "apple" | "google" | "stripe" | "asaas";
  payment_method: "app_store" | "google_play" | "card" | "pix";
  offering_type: string | null;
  status: "draft" | "scheduled" | "active" | "retired";
  commission_percentage: number;
  processing_percentage: number;
  fixed_amount: number;
  rounding_mode: "half_up" | "down" | "up";
  rounding_increment: number;
  effective_from: string;
  effective_to: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface StaffChannelCostPolicyCommandData {
  provider?: "apple" | "google" | "stripe" | "asaas";
  payment_method?: "app_store" | "google_play" | "card" | "pix";
  offering_type?: string | null;
  commission_percentage?: number;
  processing_percentage?: number;
  fixed_amount?: number;
  rounding_mode?: "half_up" | "down" | "up";
  rounding_increment?: number;
  effective_from?: string;
  effective_to?: string | null;
}

export interface StaffChannelCostPolicyPage {
  items: StaffChannelCostPolicy[];
  total: number;
  limit: number;
  offset: number;
}

export interface StaffCommunities {
  items: StaffCommunity[];
  total: number;
}

export interface StaffCommunity {
  id: string;
  name: string;
  image_url?: string | null;
  business_id?: string | null;
  business_name?: string | null;
  status: "draft" | "published" | "entry_paused" | "read_only" | "suspended" | "archived";
  visibility: "listed" | "hidden";
  access_mode: "open" | "approval" | "invite" | "paid";
  publishing: "admins" | "team" | "members";
  member_count: number;
  pending_posts: number;
  created_at: string;
}

export interface StaffCommunityDecision {
  id: string;
  status: "published" | "read_only" | "suspended" | "archived";
}

export interface StaffCompensationMatrix {
  id: string;
  offering_type: string;
  affinity_group: string | null;
  region_code: string | null;
  currency: string;
  status: "draft" | "scheduled" | "active" | "retired";
  effective_from: string;
  effective_to: string | null;
  version: number;
  scenarios: StaffCompensationScenario[];
  created_at: string;
  updated_at: string;
}

export interface StaffCompensationMatrixCommandData {
  offering_type?: string;
  affinity_group?: string | null;
  region_code?: string | null;
  currency?: string;
  effective_from?: string;
  effective_to?: string | null;
  scenario?: "direct_to_principal" | "via_associate" | "no_principal" | "via_associate_without_principal";
  professional_share?: number;
  associate_share?: number;
  principal_share?: number;
  platform_share?: number;
  rationale?: string;
}

export interface StaffCompensationMatrixPage {
  items: StaffCompensationMatrix[];
  total: number;
  limit: number;
  offset: number;
}

export interface StaffCompensationScenario {
  scenario: "direct_to_principal" | "via_associate" | "no_principal" | "via_associate_without_principal";
  professional_share: number;
  associate_share: number;
  principal_share: number;
  platform_share: number;
  rationale: string;
}

export interface StaffCompensationSimulation {
  amount: number;
  currency: string;
  matrix_id: string;
  scenario: string;
  channel_cost_policy_id: string;
  channel_cost: number;
  professional: number;
  associate: number;
  principal: number;
  platform_gross: number;
  platform_net: number;
}

export interface StaffCourseCommentReport {
  id: string;
  comment_id: string;
  body: string;
  comment_status: string;
  course_id: string;
  lesson_id: string;
  author: OrgAccountCard;
  reason: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface StaffCourseCommentReportActionResult {
  id: string;
  comment_id: string;
  action: "dismiss" | "remove";
  status: "resolved" | "rejected";
  resolved_at: string;
}

export interface StaffCourseCommentReportPage {
  items: StaffCourseCommentReport[];
  total: number;
  limit: number;
  offset: number;
}

export interface StaffCredentialResetResult {
  ok: boolean;
  email_sent: boolean;
  factors_removed: number;
}

export interface StaffDashboard {
  section: "overview" | "acquisition" | "activation" | "engagement" | "retention" | "network" | "business" | "accounts";
  from: string;
  to: string;
  overview: StaffDashboardOverview;
  app_activity: StaffDashboardAppActivity;
  finance: StaffDashboardFinance;
  outbox: StaffDashboardOutbox;
  weekly_activity: StaffDashboardWeeklyActivity[];
  weekly_finance: StaffDashboardWeeklyFinance[];
  metrics: StaffDashboardMetric[];
  totals: StaffDashboardTotals;
  notes: string[];
  generated_at: string;
}

export interface StaffDashboardAppActivity {
  posts_total: number;
  posts_published_today: number;
  post_likes_total: number;
  post_comments_total: number;
  workout_sessions_total: number;
  active_authors_total: number;
}

export interface StaffDashboardFinance {
  transactions_total: number;
  transactions_paid_today_count: number;
  transactions_paid_today_value: number;
  transactions_paid_month_count: number;
  transactions_paid_month_value: number;
  gross_revenue_total: number;
  net_revenue_total: number;
  platform_commission_total: number;
  pending_settlement_value: number;
  active_subscriptions_total: number;
}

export interface StaffDashboardMetric {
  date: string;
  name: string;
  value: number;
  scope: string;
  scope_id: string;
}

export interface StaffDashboardOutbox {
  pending: number;
  running: number;
  done: number;
  failed: number;
}

export interface StaffDashboardOverview {
  profiles_total: number;
  profiles_created_today: number;
  workout_sessions_completed_today: number;
  pending_content_reports: number;
}

export interface StaffDashboardTotals {
  accounts: number;
  businesses: number;
  open_queue: number;
}

export interface StaffDashboardWeeklyActivity {
  date: string;
  completed_sessions: number;
  posts_created: number;
  comments_created: number;
}

export interface StaffDashboardWeeklyFinance {
  date: string;
  gross_value: number;
  platform_commission: number;
}

export interface StaffDisputeChallenge {
  id: string;
  name: string;
  ends_at: string;
  metric: string;
}

export interface StaffDisputeParticipant {
  id: string;
  username: string;
  display_name: string;
}

export interface StaffEmailAttachment {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  content_disposition: "inline" | "attachment";
  availability_status: "stored" | "too_large" | "download_failed";
}

export interface StaffEmailAttachmentDownload {
  url: string;
  expires_in: number;
  filename: string;
}

export interface StaffEmailMailbox {
  id: string;
  email: string;
  display_name: string;
  unread_count: number;
}

export interface StaffEmailMessage {
  id: string;
  resend_email_id: string;
  message_id: string | null;
  direction: "inbound" | "outbound";
  from_email: string;
  from_name: string | null;
  to_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  reply_to_emails: string[];
  subject: string;
  html_content: string;
  text_content: string;
  status: "processing" | "queued" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "complained" | "failed" | "received";
  error_message: string | null;
  in_reply_to: string | null;
  reference_message_ids: string[];
  provider_created_at: string;
  attachments: StaffEmailAttachment[];
}

export interface StaffEmailOutboundAttachment {
  filename: string;
  content_type: string;
  content_base64: string;
}

export interface StaffEmailSendResult {
  id: string;
  resend_email_id: string;
  message_id: string;
  thread_id: string;
  deduplicated: boolean;
}

export interface StaffEmailSyncResult {
  ok: true;
  received: number;
  sent: number;
  errors: number;
}

export interface StaffEmailThread {
  id: string;
  mailbox_id: string;
  mailbox_email: string;
  mailbox_name: string;
  subject: string;
  external_participants: string[];
  latest_message_at: string;
  messages: StaffEmailMessage[];
}

export interface StaffEmailThreadListItem {
  id: string;
  mailbox_id: string;
  mailbox_email: string;
  mailbox_name: string;
  subject: string;
  external_participants: string[];
  latest_message_at: string;
  latest_snippet: string;
  latest_direction: "inbound" | "outbound";
  latest_status: "processing" | "queued" | "sent" | "delivered" | "delivery_delayed" | "bounced" | "complained" | "failed" | "received";
  message_count: number;
  has_attachments: boolean;
  is_unread: boolean;
}

export interface StaffEmailThreadRead {
  thread_id: string;
  read: true;
}

export interface StaffEmailThreads {
  items: StaffEmailThreadListItem[];
  total: number;
}

export interface StaffExercise {
  id: string;
  name: string;
  instructions: string | null;
  kind: "exercise" | "technique";
  sport_ids: string[];
  locale: "pt-BR" | "en-US" | "es";
  visibility: "public";
  localizations: TrainingExerciseLocalization[];
  muscles: string[];
  equipment: string | null;
  video_url: string | null;
  thumb_url: string | null;
  video_file_id: string | null;
  thumb_file_id: string | null;
  own: boolean;
  favorite: boolean;
  version: number | null;
  archived: boolean;
}

export interface StaffExerciseCatalogPage {
  items: StaffExercise[];
  total: number;
  limit: number;
  offset: number;
}

export interface StaffExerciseMediaComplete {
  action: "complete";
  request_id: string;
  idempotency_key: string;
}

export interface StaffExerciseMediaPending {
  file_id: string;
  status: "pending";
  upload_url: string;
  upload_headers: StaffExerciseUploadHeaders;
  expires_in: number;
}

export interface StaffExerciseMediaPrepare {
  action: "prepare";
  request_id: string;
  media_kind: "video" | "thumbnail";
  filename: string;
  mime: "video/mp4" | "video/webm" | "video/quicktime" | "image/jpeg" | "image/png" | "image/webp";
  bytes: number;
}

export interface StaffExerciseMediaReady {
  file_id: string;
  media_kind: "video" | "thumbnail";
  status: "ready";
  public_url: string;
}

export type StaffExerciseMediaUploadCommand = StaffExerciseMediaPrepare | StaffExerciseMediaComplete;

export type StaffExerciseMediaUploadResult = StaffExerciseMediaPending | StaffExerciseMediaReady;

export interface StaffExerciseUploadHeaders {
  "Content-Type": string;
  "Content-Length": string;
}

export interface StaffFeedSettings {
  followed_slots: number;
  discovery_slots: number;
  version: number;
  selection_mode: "global_groups" | "followed_discovery";
  prioritize_followed: boolean;
  publication_policy: SocialPublicationPolicy;
}

export interface StaffFightTechniqueData {
  label: string;
  name_en: string | null;
  name_es: string | null;
  description_ptbr: string | null;
  technique_type: "attack" | "defense";
  distance: "long" | "mid" | "close" | "clinch" | "ground";
  disciplines: string[];
  video_url: string | null;
  thumb_url: string | null;
}

export interface StaffFightTechniqueDataInput {
  name_en: string | null;
  name_es: string | null;
  description_ptbr: string | null;
  technique_type: "attack" | "defense";
  distance: "long" | "mid" | "close" | "clinch" | "ground";
  disciplines: string[];
  video_url: string | null;
  thumb_url: string | null;
}

export interface StaffFightTechniqueItem {
  kind: "fight_techniques";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffFightTechniqueData;
  impact: StaffCatalogImpact;
}

export interface StaffFightTechniqueSave {
  kind: "fight_techniques";
  key: string;
  label: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffFightTechniqueDataInput;
}

export interface StaffFinancialControlFlags {
  open_reconciliation_exceptions: number;
  unprocessed_provider_events: number;
}

export interface StaffFinancialOffering {
  id: string;
  business_id: string;
  business_name: string;
  type: string;
  type_name: string | null;
  name: string;
  status: string;
  billing_type: string;
  billing_interval: string | null;
  price: number | null;
  currency: string;
  readiness: "ready" | "not_ready" | "pricing_required" | "configuration_required";
  native_products: StaffNativeProductSummary[];
  created_at: string;
  updated_at: string;
  version: number;
}

export interface StaffFinancialOfferingPage {
  items: StaffFinancialOffering[];
  total: number;
  limit: number;
  offset: number;
}

export interface StaffFinancialReports {
  generated_at: string;
  currency: string;
  summary: StaffFinancialSummary;
  settlement_by_status: StaffSettlementStatusSummary[];
  sales_by_offering_type: StaffOfferingTypeSalesSummary[];
  sales_by_professional: StaffProfessionalSalesSummary[];
  subscription_statuses: StaffSubscriptionStatusSummary[];
  payout_statuses: StaffPayoutStatusSummary[];
  audit_events: StaffAuditEventSummary[];
  provider_events: StaffProviderEventSummary[];
  journal_accounts: StaffJournalAccountSummary[];
  reconciliation: StaffReconciliationSummary;
  control_flags: StaffFinancialControlFlags;
}

export interface StaffFinancialSummary {
  transactions_total: number;
  successful_transactions: number;
  failed_transactions: number;
  reversal_transactions: number;
  gross_revenue: number;
  net_revenue: number | null;
  asaas_fees: number | null;
  platform_commission: number;
  professional_net: number;
  average_ticket: number;
  take_rate_net_percent: number;
  take_rate_gross_percent: number;
  asaas_fee_rate_percent: number | null;
  professional_share_net_percent: number;
  pending_settlement_value: number;
  settled_professional_value: number;
  wallet_available: number;
  wallet_pending: number | null;
  wallet_reserved: number;
  active_subscriptions: number;
  active_subscription_mrr: number | null;
  synthetic_transactions: number;
  open_payout_amount: number;
  open_payout_count: number;
  paid_payout_amount: number;
  paid_payout_count: number;
}

export interface StaffFirstContactContract {
  id: string;
  started_at: string;
  hours_waiting: number;
  welcome_message_sent_at: string | null;
  welcome_message_error: string | null;
  offering_name: string;
  professional_name: string;
  member_name: string;
}

export interface StaffFirstContactSettings {
  reminder_hours: number;
  alert_hours: number;
  version: number;
}

export interface StaffFirstContacts {
  items: StaffFirstContactContract[];
  total: number;
  has_more: boolean;
}

export interface StaffFoodSourceData {
  origin: "taco" | "tbca" | "usda" | "brand" | "restaurant" | "personal";
  display_name_key: string;
  license_name: string | null;
  license_url: string | null;
  attribution_text: string | null;
  homepage_url: string | null;
  verified_by_default: boolean;
  search_priority: number;
}

export interface StaffFoodSourceDataInput {
  origin: "taco" | "tbca" | "usda" | "brand" | "restaurant" | "personal";
  display_name_key: string;
  license_name: string | null;
  license_url: string | null;
  attribution_text: string | null;
  homepage_url: string | null;
  verified_by_default: boolean;
  search_priority: number;
}

export interface StaffFoodSourceItem {
  kind: "food_sources";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffFoodSourceData;
  impact: StaffCatalogImpact;
}

export interface StaffFoodSourceSave {
  kind: "food_sources";
  key: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffFoodSourceDataInput;
}

export interface StaffHealthDiet {
  kind: "diet";
  id: string;
  title: string;
  sport_id: null;
  status: "active" | "inactive";
  version: number;
  updated_at: string;
  detail: StaffHealthDietDetail;
}

export interface StaffHealthDietDetail {
  objective: string;
  meals: NutritionDietMeal[];
  targets: NutritionTargets;
}

export interface StaffHealthDietPayload {
  kind: "diet";
  title: string;
  objective: string;
  meals: NutritionDietMealInput[];
}

export type StaffHealthLibraryItem = StaffHealthWorkout | StaffHealthDiet | StaffHealthProgram;

export interface StaffHealthLibraryPage {
  items: StaffHealthLibraryItem[];
  total: number;
  limit: number;
  offset: number;
}

export type StaffHealthLibraryPayload = StaffHealthWorkoutPayload | StaffHealthDietPayload | StaffHealthProgramPayload;

export interface StaffHealthProgram {
  kind: "program";
  id: string;
  title: string;
  sport_id: string;
  status: "active" | "inactive";
  version: number;
  updated_at: string;
  detail: StaffHealthProgramDetail;
}

export interface StaffHealthProgramDay {
  week: number;
  weekday: number;
  workout_id: string;
  order_index: number;
}

export interface StaffHealthProgramDetail {
  weeks: number;
  description: string;
  estimated_minutes_per_week: number | null;
  equipment: string[];
  days: StaffHealthProgramDay[];
}

export interface StaffHealthProgramPayload {
  kind: "program";
  title: string;
  description: string;
  estimated_minutes_per_week: number | null;
  equipment: string[];
  sport_id: string;
  weeks: number;
  days: StaffHealthProgramDay[];
}

export interface StaffHealthWorkout {
  kind: "workout";
  id: string;
  title: string;
  sport_id: string;
  status: "active" | "inactive";
  version: number;
  updated_at: string;
  detail: StaffHealthWorkoutDetail;
}

export interface StaffHealthWorkoutDetail {
  notes: string;
  steps: ProfessionalWorkoutStep[];
}

export interface StaffHealthWorkoutPayload {
  kind: "workout";
  title: string;
  sport_id: string;
  notes: string;
  steps: ProfessionalWorkoutStepSaveInput[];
}

export interface StaffInviteEmailsSendResult {
  queued: string[];
  skipped: string[];
}

export interface StaffInviteReleaseResult {
  released: boolean;
  email_queued: boolean;
  email: string;
}

export interface StaffInviteSettings {
  invite_only_enabled: boolean;
  version: number;
  updated_at: string;
  invited_count: number;
  waiting_count: number;
  released_count: number;
  pending_welcome_count: number;
}

export interface StaffInviteWaitlist {
  items: StaffInviteWaitlistEntry[];
  total: number;
  waiting_count: number;
  released_count: number;
}

export interface StaffInviteWaitlistEntry {
  user_id: string;
  email: string;
  full_name: string | null;
  username: string;
  avatar_url: string | null;
  status: "waiting" | "released";
  attempts: number;
  created_at: string;
  last_attempt_at: string;
  released_at: string | null;
  welcome_email_sent_at: string | null;
  onboarding_completed: boolean;
  email_confirmed: boolean;
}

export interface StaffInvitedEmail {
  id: string;
  email: string;
  note: string | null;
  source: "manual" | "waitlist_release" | "grandfathered";
  created_at: string;
  has_account: boolean;
  invite_email_sent_at: string | null;
}

export interface StaffInvitedEmailRemoveResult {
  email: string;
  removed: boolean;
}

export interface StaffInvitedEmails {
  items: StaffInvitedEmail[];
  total: number;
}

export interface StaffInvitedEmailsAddResult {
  added: string[];
  skipped: string[];
  invalid: string[];
}

export interface StaffJournalAccountSummary {
  code: string;
  balance: number;
}

export interface StaffLegalDocumentCurrent {
  key: string;
  version: string;
  revision: number;
  journey: "signup" | "consultancy_hire" | "become_professional" | "account_deletion" | null;
  is_active: boolean;
}

export interface StaffLegalDocumentPublishResult {
  key: string;
  version: string;
  revision: number;
  journey: "signup" | "consultancy_hire" | "become_professional" | "account_deletion" | null;
  is_active: boolean;
  published: boolean;
}

export interface StaffLegalDocumentUpload {
  upload_id: string;
  upload_url: string;
  upload_headers: StaffLegalDocumentUploadHeaders;
  expires_in: number;
}

export interface StaffLegalDocumentUploadHeaders {
  "Content-Type": "application/pdf";
}

export interface StaffLegalDocumentVersion {
  key: string;
  version: string;
  kind: "acceptance" | "notice" | "declaration";
  title: string;
  description: string;
  pdf_url: string;
  acceptance_text: string;
  action_label: string;
  is_required: boolean;
  sort_order: number;
  journey: "signup" | "consultancy_hire" | "become_professional" | "account_deletion" | null;
  revision: number | null;
  published_at: string;
  is_current: boolean;
  is_active: boolean;
  accepted_count: number;
  eligible_count: number;
  pending_count: number;
}

export interface StaffMarketStore {
  key: string;
  business_id: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
  business_status: string;
  tagline?: string | null;
  category?: string | null;
  cover_image_url?: string | null;
  official: boolean;
  featured: boolean;
  featured_starts_at?: string | null;
  featured_ends_at?: string | null;
  position: number;
  version: number;
}

export interface StaffMarketStoreBusiness {
  id: string;
  name: string;
  logo_url: string;
  status: string;
  already_configured: boolean;
}

export interface StaffMarketStoreInput {
  key: string;
  business_id: string;
  tagline?: string | null;
  category?: string | null;
  cover_image_url?: string | null;
  official: boolean;
  featured: boolean;
  featured_starts_at?: string | null;
  featured_ends_at?: string | null;
  position: number;
  expected_version?: number | null;
}

export interface StaffMarketStores {
  can_edit: boolean;
  items: StaffMarketStore[];
  businesses: StaffMarketStoreBusiness[];
}

export interface StaffMemberAccess {
  id: string;
  account: OrgAccountCard;
  offer_id: string;
  offer_name: string;
  business_id: string;
  delivery: string;
  resource_type: string;
  resource_id: string;
  financial_status: "active" | "past_due" | "ended";
  valid_from: string;
  valid_until: string | null;
  held: boolean;
  hold: StaffMemberAccessHold | null;
  version: number;
  updated_at: string;
}

export interface StaffMemberAccessHold {
  id: string;
  reason: string;
  held_at: string;
}

export interface StaffMemberAccessPage {
  items: StaffMemberAccess[];
  total: number;
  limit: number;
  offset: number;
}

export interface StaffMemberAreaAuditItem {
  id: number;
  action: string;
  subject_type: string;
  subject_id: string;
  actor_id: string | null;
  reason: string | null;
  created_at: string;
}

export interface StaffMemberAreaAuditPage {
  items: StaffMemberAreaAuditItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface StaffNativeProduct {
  offer_id: string;
  offer_name: string;
  channel: "app_store" | "google_play";
  product_id: string;
  product_type: "auto_renewable_subscription" | "non_consumable" | "non_renewing_subscription" | "consumable";
  price: number;
  currency: string;
  status: "draft" | "ready" | "retired";
  subscription_group_reference: string | null;
  version: number;
}

export interface StaffNativeProductInput {
  offer_id: string;
  channel: "app_store" | "google_play";
  product_id: string;
  product_type: "auto_renewable_subscription" | "non_consumable" | "non_renewing_subscription";
  price: number;
  currency: string;
  status: "draft" | "ready" | "retired";
  subscription_group_reference: string | null;
  expected_version?: number | null;
}

export interface StaffNativeProductSaved {
  offer_id: string;
  channel: "app_store" | "google_play";
  product_id: string;
  product_type: "auto_renewable_subscription" | "non_consumable" | "non_renewing_subscription" | "consumable";
  price: number;
  currency: string;
  status: "draft" | "ready" | "retired";
  subscription_group_reference: string | null;
  version: number;
}

export interface StaffNativeProductSummary {
  offer_id: string;
  channel: "app_store" | "google_play";
  product_id: string;
  product_type: "auto_renewable_subscription" | "non_consumable" | "non_renewing_subscription" | "consumable";
  status: "draft" | "ready" | "retired";
  subscription_group_reference: string | null;
  price: number;
  currency: string;
  version: number;
}

export interface StaffNutrientData {
  unit: "kcal" | "g" | "mg" | "mcg";
  display_name_key: string;
}

export interface StaffNutrientDataInput {
  unit: "kcal" | "g" | "mg" | "mcg";
  display_name_key: string;
}

export interface StaffNutrientItem {
  kind: "nutrients";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffNutrientData;
  impact: StaffCatalogImpact;
}

export interface StaffNutrientSave {
  kind: "nutrients";
  key: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffNutrientDataInput;
}

export interface StaffOfferTypeItem {
  kind: "offer_types";
  key: string;
  label: string;
  description: string;
  icon: string | null;
  active: boolean;
  position: number;
  version: number;
  delivery: "club" | "consultancy" | "workout" | "program" | "protocol" | "diet" | "physical_product" | "course" | "challenge" | "community" | "platform_membership" | "advertising";
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: string | null;
  allowed_billing_intervals: ("week" | "month" | "2month" | "quarter" | "semester" | "year")[];
  minimum_price: number;
  minimum_monthly_price: number | null;
  platform_fee_percent: number;
  platform_fee_fixed: number;
  max_per_business: number | null;
  unique_per_owner_profile: boolean;
  requires_affinity_group: boolean;
  requires_product_category: boolean;
  active_offers_count: number;
  configured: boolean;
}

export interface StaffOfferTypeSave {
  kind: "offer_types";
  key: string;
  label: string;
  description: string;
  icon: string | null;
  position: number;
  delivery: "club" | "consultancy" | "workout" | "program" | "protocol" | "diet" | "physical_product" | "course" | "challenge" | "community" | "platform_membership" | "advertising";
  billing_type: "one_time" | "recurring" | "free";
  billing_interval: string | null;
  allowed_billing_intervals: ("week" | "month" | "2month" | "quarter" | "semester" | "year")[];
  minimum_price: number;
  minimum_monthly_price: number | null;
  platform_fee_percent: number;
  platform_fee_fixed: number;
  max_per_business: number | null;
  unique_per_owner_profile: boolean;
  requires_affinity_group: boolean;
  requires_product_category: boolean;
  expected_version?: number | null;
}

export interface StaffOfferingTypeSalesSummary {
  offering_type: string;
  offering_type_name: string;
  transactions_count: number;
  gross_revenue: number;
  platform_commission: number;
  professional_net: number;
  take_rate_net_percent: number;
}

export interface StaffPaymentCredentialsInput {
  stripe_publishable_key?: string;
  stripe_secret_key?: string;
  stripe_webhook_secret?: string;
  asaas_api_key?: string;
  asaas_webhook_token?: string;
}

export interface StaffPaymentProviderItem {
  kind: "payment_providers";
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
  asaas_webhook_token_last4: string | null;
  updated_at: string | null;
}

export interface StaffPaymentProviderSave {
  kind: "payment_providers";
  environment: "sandbox" | "production";
  credentials: StaffPaymentCredentialsInput;
}

export interface StaffPaymentSettings {
  payout_processing_hours: number;
  payout_minimum_amount: number;
  card_settlement_days: number;
  settlement_weekdays: number[];
  ios_iap_commission_percent: number;
  ios_iap_processing_percent: number;
  ios_iap_fixed_fee: number;
  ios_iap_rounding_increment: number;
  ios_iap_pricing_enabled: boolean;
  ios_iap_pricing_version: number;
  updated_at: string | null;
  version: number;
}

export interface StaffPaymentSettingsInput {
  payout_processing_hours: number;
  payout_minimum_amount: number;
  card_settlement_days: number;
  settlement_weekdays: number[];
  ios_iap_commission_percent: number;
  ios_iap_processing_percent: number;
  ios_iap_fixed_fee: number;
  ios_iap_rounding_increment: number;
  ios_iap_pricing_enabled: boolean;
}

export interface StaffPaymentTransaction {
  id: string;
  provider: "asaas" | "stripe" | "app_store" | "free" | "unknown";
  payment_method: "card" | "pix" | "app_store" | "free" | null;
  provider_payment_id: string;
  asaas_payment_id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  offering_id: string;
  offering_name: string;
  billing_type: "one_time" | "recurring" | "free";
  buyer_profile_id: string;
  buyer_name: string;
  professional_profile_id: string | null;
  professional_name: string;
  gross_value: number;
  net_value: number | null;
  asaas_fee: number | null;
  provider_fee: number | null;
  platform_commission: number | null;
  professional_net: number | null;
  status: "created" | "pending" | "confirmed" | "settled" | "failed" | "refunded" | "chargeback";
  settlement_status: "pending" | "confirmed" | "settled" | "refunded" | "chargeback";
  provider_status: string | null;
  card_brand: string | null;
  card_last4: string | null;
  estimated_credit_date: string | null;
  credit_date: string | null;
  expires_at: string | null;
  invoice_url: string | null;
  created_at: string;
}

export interface StaffPaymentTransactionPage {
  total: number;
  limit: number;
  offset: number;
  items: StaffPaymentTransaction[];
}

export interface StaffPayout {
  id: string;
  professional_profile_id: string;
  professional_name: string;
  professional_username: string | null;
  amount: number;
  currency: string;
  status: "pending_approval" | "approved" | "payment_recorded" | "paid" | "rejected" | "failed" | "reversed";
  pix_key_type: string;
  pix_key_last4: string;
  available_balance_snapshot: number;
  settlement_date: string;
  requested_at: string | null;
  approved_at: string | null;
  paid_at: string | null;
  payment_recorded_at: string | null;
  manual_payment_reference: string | null;
  payment_proof_file_id: string | null;
  batch_id: string | null;
  rejection_reason: string | null;
  failure_reason: string | null;
  version: number;
}

export interface StaffPayoutBatch {
  id: string;
  settlement_date: string;
  currency: string;
  payout_count: number;
  total_amount: number;
  created_at: string;
}

export interface StaffPayoutDay {
  settlement_date: string;
  currency: string;
  pending_count: number;
  pending_amount: number;
  approved_count: number;
  approved_amount: number;
  payment_recorded_count: number;
  payment_recorded_amount: number;
  actionable_count: number;
  actionable_amount: number;
}

export interface StaffPayoutDayPage {
  items: StaffPayoutDay[];
  limit: number;
  offset: number;
}

export interface StaffPayoutPage {
  total: number;
  limit: number;
  offset: number;
  items: StaffPayout[];
}

export type StaffPayoutProofCommand = StaffPayoutProofPrepare | StaffPayoutProofComplete | StaffPayoutProofRead;

export interface StaffPayoutProofComplete {
  action: "complete";
  request_id: string;
  idempotency_key: string;
}

export interface StaffPayoutProofPending {
  file_id: string;
  status: "pending";
  upload_url: string;
  upload_headers: StaffUploadHeaders;
  expires_in: number;
}

export interface StaffPayoutProofPrepare {
  action: "prepare";
  payout_id: string;
  request_id: string;
  filename: string;
  mime: "application/pdf" | "image/png" | "image/jpeg";
  bytes: number;
}

export interface StaffPayoutProofRead {
  action: "read";
  file_id: string;
}

export interface StaffPayoutProofReadable {
  file_id: string;
  status: "readable";
  download_url: string;
  expires_in: number;
}

export interface StaffPayoutProofReady {
  file_id: string;
  status: "ready";
}

export type StaffPayoutProofResult = StaffPayoutProofPending | StaffPayoutProofReady | StaffPayoutProofReadable;

export interface StaffPayoutStatusSummary {
  status: string;
  payouts_count: number;
  total_amount: number;
}

export interface StaffProductCategoryData {
  label: string;
  icon: string;
}

export interface StaffProductCategoryDataInput {
  icon: string;
}

export interface StaffProductCategoryItem {
  kind: "product_categories";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffProductCategoryData;
  impact: StaffCatalogImpact;
}

export interface StaffProductCategorySave {
  kind: "product_categories";
  key: string;
  label: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffProductCategoryDataInput;
}

export interface StaffProfessionalCredential {
  id: string;
  profile_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  specialty: string;
  council: string;
  jurisdiction: string;
  registration: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
}

export interface StaffProfessionalCredentialDecision {
  id: string;
  status: "approved" | "rejected";
}

export interface StaffProfessionalCredentials {
  items: StaffProfessionalCredential[];
  total: number;
  next_cursor: string | null;
}

export interface StaffProfessionalSalesSummary {
  professional_profile_id: string;
  professional_name: string;
  professional_username: string | null;
  transactions_count: number;
  gross_revenue: number;
  platform_commission: number;
  pending_settlement_value: number;
  wallet_available: number;
  take_rate_net_percent: number;
}

export interface StaffProfessionalSpecialtyData {
  label: string;
  council: string;
  regulated: boolean;
}

export interface StaffProfessionalSpecialtyDataInput {
  council: string;
  regulated: boolean;
}

export interface StaffProfessionalSpecialtyItem {
  kind: "professional_specialties";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffProfessionalSpecialtyData;
  impact: StaffCatalogImpact;
}

export interface StaffProfessionalSpecialtySave {
  kind: "professional_specialties";
  key: string;
  label: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffProfessionalSpecialtyDataInput;
}

export interface StaffProtocolData {
  flow: "generic" | "water" | "supplement";
  icon_key: "sparkles" | "droplets" | "glass-water" | "pill" | "moon" | "bed" | "timer" | "alarm-clock" | "heart-pulse" | "scan-heart" | "hand-heart" | "brain" | "target" | "leaf" | "flower-2" | "flame" | "waves" | "wind" | "sun" | "activity" | "dumbbell" | "bike" | "apple" | "salad" | "stethoscope" | "smile" | "notebook-pen";
  translations: StaffProtocolTranslation[];
  structure_locked: boolean;
  clinical_notice: boolean;
  featured: boolean;
  default_steps: StaffProtocolStep[];
}

export interface StaffProtocolDataRead {
  label: string;
  flow: "generic" | "water" | "supplement";
  icon_key: "sparkles" | "droplets" | "glass-water" | "pill" | "moon" | "bed" | "timer" | "alarm-clock" | "heart-pulse" | "scan-heart" | "hand-heart" | "brain" | "target" | "leaf" | "flower-2" | "flame" | "waves" | "wind" | "sun" | "activity" | "dumbbell" | "bike" | "apple" | "salad" | "stethoscope" | "smile" | "notebook-pen";
  translations: StaffProtocolTranslation[];
  structure_locked: boolean;
  clinical_notice: boolean;
  featured: boolean;
  default_steps: StaffProtocolStep[];
}

export interface StaffProtocolStep {
  translations: StaffProtocolStepTranslation[];
  time: string | null;
  duration_minutes: number | null;
}

export interface StaffProtocolStepTranslation {
  locale: "pt-BR" | "pt-PT" | "en";
  name: string;
  instruction?: string | null;
}

export interface StaffProtocolTemplateItem {
  kind: "protocol_templates";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffProtocolDataRead;
  impact: StaffCatalogImpact;
}

export interface StaffProtocolTemplateSave {
  kind: "protocol_templates";
  key: string;
  label: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffProtocolData;
}

export interface StaffProtocolTranslation {
  locale: "pt-BR" | "pt-PT" | "en";
  name: string;
  category: string;
  description: string;
}

export interface StaffProviderEventSummary {
  event_name: string;
  events_count: number;
  unprocessed_count: number;
}

export interface StaffReconciliationRun {
  id: string;
  provider: "all" | "stripe" | "asaas" | "apple" | "google";
  period_start: string;
  period_end: string;
  status: "open" | "completed" | "failed";
  exception_count: number;
  created_at: string;
  completed_at: string | null;
}

export interface StaffReconciliationRunPage {
  total: number;
  limit: number;
  offset: number;
  items: StaffReconciliationRun[];
}

export interface StaffReconciliationSummary {
  runs_total: number;
  open_runs: number;
  exception_count: number;
  last_completed_at: string | null;
}

export interface StaffReportedReview {
  id: string;
  rating: number;
  comment: string | null;
  status: "published" | "hidden";
  offering_id: string;
  author_id: string;
  seller_reply: string | null;
}

export interface StaffReviewReport {
  id: string;
  reason: "spam" | "abuse" | "fraud" | "privacy" | "misinformation" | "other";
  details: string | null;
  status: "pending" | "kept" | "hidden";
  created_at: string;
  offering_name: string;
  reporter: StaffReviewReporter;
  review: StaffReportedReview;
}

export interface StaffReviewReportDecision {
  id: string;
  status: "kept" | "hidden";
  review_status: "published" | "hidden";
}

export interface StaffReviewReporter {
  id: string;
  name: string;
}

export interface StaffReviewReports {
  items: StaffReviewReport[];
  total: number;
}

export interface StaffSessionTypeData {
  label: string;
  icon_key: string;
  sports: string[];
}

export interface StaffSessionTypeDataInput {
  icon_key: string;
  sports: string[];
}

export interface StaffSessionTypeItem {
  kind: "session_types";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffSessionTypeData;
  impact: StaffCatalogImpact;
}

export interface StaffSessionTypeSave {
  kind: "session_types";
  key: string;
  label: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffSessionTypeDataInput;
}

export interface StaffSettlementStatusSummary {
  settlement_status: "pending" | "confirmed" | "refunded";
  transactions_count: number;
  professional_net: number;
}

export interface StaffSportData {
  label?: string;
  engine: "strength" | "endurance" | "crossfit" | "hyrox" | "combat" | "compositional";
  affinity_group_id: string | null;
}

export interface StaffSportDataInput {
  engine: "strength" | "endurance" | "crossfit" | "hyrox" | "combat" | "compositional";
  affinity_group_id: string | null;
}

export interface StaffSportItem {
  kind: "sports";
  key: string;
  name_key: string;
  active: boolean;
  public: boolean;
  position: number;
  version: number;
  data: StaffSportData;
  impact: StaffCatalogImpact;
}

export interface StaffSportSave {
  kind: "sports";
  key: string;
  name_key: string;
  public: boolean;
  position: number;
  expected_version?: number | null;
  data: StaffSportDataInput;
}

export interface StaffSubscriptionStatusSummary {
  status: string;
  subscriptions_count: number;
  total_value: number | null;
}

export interface StaffTrainingQuota {
  free_personal_workout_limit: number;
  club_personal_workout_limit: number;
  version: number;
}

export interface StaffTreasuryMovement {
  id: string;
  transaction_id: string;
  direction: "invest" | "redeem";
  amount: number;
  currency: string;
  reference: string;
  note: string | null;
  created_at: string;
}

export interface StaffUploadHeaders {
  "Content-Type": string;
  "Content-Length": string;
}

export interface StepMark {
  status: string | null;
  reason: string | null;
  note: string | null;
  value: number | null;
}

export interface StoryMediaAccess {
  downloadUrl: string;
  expiresIn: number;
}

export interface StrengthPrescription {
  engine: "strength";
  sets: number;
  reps?: string | number;
  reps_per_set?: (string | number)[];
  load?: string | number;
  rest_s?: string | number;
  rest_per_set?: (string | number)[];
  cadence?: string | number;
  rpe?: string | number;
  notes?: string;
}

export interface SystemStatus {
  maintenance: boolean;
  message_key: string | null;
  started_at: string | null;
  retry_after_seconds: number;
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

export interface TrainingActivityItem {
  id: string;
  source: "app" | "watch" | "health" | "manual";
  provider: string | null;
  activity_type: string | null;
  sport_id: string | null;
  title: string | null;
  local_date: string;
  started_at: string;
  ended_at: string | null;
  metrics: Record<string, number>;
  scheduled_id: string | null;
  link_method: "session" | "exact" | "auto" | "manual" | null;
  link_confidence: number | null;
  workout_title: string | null;
  has_route: boolean;
  origin: TrainingActivityOrigin;
}

export interface TrainingActivityOrigin {
  bundle_identifier?: string;
  source_name?: string;
  device_id?: string;
  device_name?: string;
  device_model?: string;
  timezone?: string;
}

export interface TrainingArchivedProtocolTemplate {
  id: string;
  archived_at: string;
  version: number;
}

export interface TrainingClientAssignment {
  id: string;
  week_number: number;
  weekdays: number[];
  order_index: number;
  workout: ProfessionalWorkoutDetail;
  workout_version: number;
  occurrences: TrainingClientOccurrence[];
}

export interface TrainingClientDay {
  date: string;
  assignments: TrainingClientDayAssignment[];
}

export interface TrainingClientDayAssignment {
  scheduled_id: string;
  program_id: string;
  workout_id: string;
  title: string;
  time: string | null;
  state: string | null;
}

export interface TrainingClientEditorResult {
  program: TrainingClientProgram;
  plan: TrainingClientPlan;
}

export interface TrainingClientHistory {
  client_id: string;
  from: string;
  to: string;
  days: TrainingClientHistoryDay[];
  last_completed_at: string | null;
}

export interface TrainingClientHistoryDay {
  date: string;
  completed_sessions: number;
  volume_load_kg: number | null;
}

export interface TrainingClientOccurrence {
  scheduled_id: string;
  date: string;
  weekday: number;
  status: "scheduled";
}

export interface TrainingClientPlan {
  business_id: string;
  client_id: string;
  week_start: string;
  programs: TrainingClientProgram[];
  days: TrainingClientDay[];
}

export interface TrainingClientProgram {
  id: string;
  business_id: string;
  client_id: string;
  source_program_id: string | null;
  title: string;
  description: string;
  estimated_minutes_per_week: number | null;
  equipment: string[];
  alias: string | null;
  sport_id: string;
  status: "draft" | "released" | "hidden" | "ended" | "removed";
  starts_at: string;
  ends_at: string;
  duration_weeks: number;
  version: number;
  assignments: TrainingClientAssignment[];
  created_at: string;
  updated_at: string;
}

export interface TrainingClientProtocol {
  id: string;
  business_id: string;
  client_id: string;
  template_id?: string | null;
  catalog_key?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  icon_key?: string | null;
  is_clinical: boolean;
  status: "draft" | "active" | "paused" | "ended";
  timezone: string;
  start_date: string;
  valid_to?: string | null;
  steps: TrainingProfessionalProtocolStep[];
  version: number;
  prescribed_at: string;
  updated_at: string;
  adherence: null;
}

export interface TrainingClientProtocolInput {
  title: string;
  description: string;
  category: string;
  steps: TrainingProfessionalProtocolStepInput[];
}

export interface TrainingClientProtocols {
  business_id: string;
  client_id: string;
  protocols: TrainingClientProtocol[];
}

export interface TrainingDay {
  date: string;
  workouts: ScheduledWorkout[];
}

export interface TrainingExercise {
  id: string;
  name: string;
  instructions: string | null;
  kind: "exercise" | "technique";
  sport_ids: string[];
  locale: "pt-BR" | "en-US" | "es";
  visibility: "private" | "public";
  muscles: string[];
  equipment: string | null;
  video_url: string | null;
  thumb_url: string | null;
  own: boolean;
  favorite: boolean;
  version: number | null;
  archived: boolean;
}

export interface TrainingExerciseFavoriteResult {
  exercise_id: string;
  favorite: boolean;
}

export interface TrainingExerciseLocalization {
  locale: "pt-BR" | "en-US" | "es";
  name: string;
  instructions: string | null;
}

export type TrainingExerciseLocalizations = TrainingExerciseLocalization[];

export interface TrainingOwnedProtocolTemplate {
  id: string;
  kind: "professional";
  business_id: string;
  source_catalog_key?: string | null;
  name: string;
  category: string;
  description: string;
  icon_key: string;
  is_clinical: boolean;
  required_council: boolean;
  structure_locked: boolean;
  steps: TrainingProfessionalProtocolStep[];
  step_count: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingPersonalProgramSaved {
  kind: "personal_program";
  program: TrainingProgram;
}

export interface TrainingPlatformProtocolTemplate {
  catalog_key: string;
  kind: "platform";
  name: string;
  category: string;
  description: string;
  icon_key: string;
  is_clinical: boolean;
  required_council: boolean;
  structure_locked: boolean;
  steps: TrainingProfessionalProtocolStep[];
  step_count: number;
  version: number;
}

export interface TrainingProfessionalLibrary {
  business_id: string;
  templates: ProfessionalWorkoutTemplate[];
  programs: TrainingProfessionalProgram[];
}

export interface TrainingProfessionalProgram {
  id: string;
  kind: "program_template";
  business_id: string;
  title: string;
  description: string;
  estimated_minutes_per_week: number | null;
  equipment: string[];
  sport_id: string;
  status: "active" | "hidden";
  duration_weeks: number;
  version: number;
  days: TrainingProfessionalProgramDay[];
  assigned_clients: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingProfessionalProgramDay {
  week_number: number;
  weekday: number;
  order_index: number;
  workout: ProfessionalWorkoutTemplate;
}

export interface TrainingProfessionalProtocolLibrary {
  business_id: string;
  templates: TrainingProfessionalProtocolTemplate[];
  platform_templates: TrainingProfessionalProtocolTemplate[];
}

export interface TrainingProfessionalProtocolStep {
  id: string;
  name: string;
  instruction?: string;
  scheduled_time?: string;
  quantity?: number;
  unit?: string;
  duration_minutes?: number;
  required: boolean;
  order_index: number;
  notification_offset_minutes?: number;
  allow_snooze: boolean;
  days_of_week?: number[];
}

export interface TrainingProfessionalProtocolStepInput {
  id?: string;
  name: string;
  instruction?: string | null;
  scheduled_time?: string | null;
  quantity?: number | null;
  unit?: string | null;
  duration_minutes?: number | null;
  required: boolean;
  order_index?: number;
  notification_offset_minutes?: number | null;
  allow_snooze?: boolean;
  days_of_week?: number[] | null;
}

export type TrainingProfessionalProtocolTemplate = TrainingOwnedProtocolTemplate | TrainingPlatformProtocolTemplate;

export interface TrainingProfessionalProtocolTemplateInput {
  source_catalog_key?: string | null;
  name: string;
  category: string;
  description: string;
  icon_key: string;
  is_clinical: boolean;
  steps: TrainingProfessionalProtocolStepInput[];
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  estimated_minutes_per_week: number | null;
  equipment: string[];
  sport_id: string;
  weeks: number;
  version: number;
  status: "active" | "removed" | "draft" | "released" | "hidden" | "ended";
  /** Whether this account can save this personal aggregate through training.programSave with business_id null. The server rechecks ownership, state and version when saving. */
  editable: boolean;
  applied: boolean;
  start_date: string | null;
  progress: TrainingProgramProgress | null;
  active_application: string | null;
  days: TrainingProgramDay[];
}

export interface TrainingProgramActionDay {
  week: number;
  weekday: number;
  workout_id: string;
  title: string;
  notes: string;
  scheduled_id: string | null;
  date: string | null;
  state: "planned" | "in_progress" | "done" | "incomplete" | "missed" | "not_done" | null;
}

/** Immutable result of a program action, including exact replays. Read training.program for current editing capability and canonical calendar positions; do not cache this receipt as that read response. */
export interface TrainingProgramActionResult {
  id: string;
  title: string;
  description: string;
  estimated_minutes_per_week: number | null;
  equipment: string[];
  sport_id: string;
  weeks: number;
  version: number;
  status: "active" | "removed" | "draft" | "released" | "hidden" | "ended";
  applied: boolean;
  start_date: string | null;
  progress: TrainingProgramProgress | null;
  active_application: string | null;
  days: TrainingProgramActionDay[];
}

export interface TrainingProgramDay {
  week: number;
  weekday: number;
  workout_id: string;
  order_index: number;
  title: string;
  notes: string;
  scheduled_id: string | null;
  date: string | null;
  state: "planned" | "in_progress" | "done" | "incomplete" | "missed" | "not_done" | null;
}

export interface TrainingProgramDaySaveInput {
  week: number;
  weekday: number;
  workout_id: string;
  order_index: number;
}

export interface TrainingProgramProgress {
  done: number;
  total: number;
}

export interface TrainingProgramSaveInput {
  id?: string;
  business_id: string | null;
  title: string;
  description: string;
  estimated_minutes_per_week: number | null;
  equipment: string[];
  sport_id: string;
  weeks: number;
  days: TrainingProgramDaySaveInput[];
  expected_version: number | null;
  idempotency_key: string;
}

export type TrainingProgramSaveResult = TrainingProfessionalProgram | TrainingPersonalProgramSaved;

/** Parciais nomeadas com valores escalares, sem documentos arbitrários aninhados. */
export type TrainingScalarMap = Record<string, string | number | boolean | null>;

/** Avaliação depois do treino (sensação, notas). */
export interface TrainingSessionReview {
  completion?: "full" | "partial";
  duration_seconds?: number;
  calories?: number;
  feeling?: string;
  notes?: string;
  /** Parciais nomeadas com valores escalares, sem documentos arbitrários aninhados. */
  partials?: TrainingScalarMap;
}

export interface TrainingSessionSetActual {
  index: number;
  completed: boolean;
  execution_item_id?: string;
  reps?: number;
  load?: TrainingSessionSetLoad;
}

export interface TrainingSessionSetLoad {
  value: number;
  unit: "kg" | "lb";
}

export interface TrainingSessionStepActual {
  completion?: "full" | "partial";
  sets?: TrainingSessionSetActual[];
  duration_seconds?: number;
  distance_m?: number;
}

/** Resultados por identificador de passo. */
export type TrainingStepActualMap = Record<string, TrainingSessionStepActual>;

export interface TrainingZones {
  cycling_ftp_watts: number | null;
  running_threshold_pace_seconds_per_km: number | null;
  threshold_heart_rate_bpm: number | null;
  max_heart_rate_bpm: number | null;
  swimming_css_seconds_per_100m: number | null;
  version: number;
}

export interface UploadFailureRecorded {
  ok: boolean;
}

export interface VideoFinalized {
  fileId: string;
  publicUrl: string | null;
  objectKey: string;
  contentType: string;
  audioMode: string;
  destination: "post" | "story";
  hasAudio: boolean;
  container: "iso-bmff" | "webm" | "ogg";
  attested: boolean;
  /** Duração real atestada pelo servidor. Zero somente para arquivos históricos sem atestado. */
  durationSeconds?: number;
}

export interface VideoPreloadSettings {
  version: number;
  rollout_version: number;
  cohort: "baseline" | "internal" | "1" | "5" | "25" | "50" | "100";
  native_engine: boolean;
  feed: boolean;
  explore: boolean;
  profile: boolean;
  stories: boolean;
  refresh_interval_seconds: number;
}

export interface VideoUpload {
  uploadId: string;
  uploadUrl: string;
  contentType: string;
  contentLength: number;
  audioMode: string;
  destination: "post" | "story";
  /** Cabeçalhos de upload definidos pelo provedor, com valores textuais. */
  uploadHeaders: Record<string, string>;
  expiresIn: number;
}

export interface VideoUploadState {
  uploadId: string;
  stage: "uploading" | "uploaded" | "processing" | "promoted" | "cancelled";
  partSize: number;
  completedParts: number[];
  partUrl?: string | null;
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

export interface WorkoutBlock {
  id: string;
  role: "warmup" | "skill" | "strength" | "wod" | "aerobic" | "power" | "hybrid" | "stamina" | "rest";
  title: string;
  format: "for_quality" | "sets" | "rounds" | "for_time" | "amrap" | "emom" | "ladder" | "rest";
  rounds?: number;
  duration_s?: number;
  interval_s?: number;
  time_cap_s?: number;
  rest_s?: number;
  scoring?: "time" | "rounds_reps" | "load" | "reps" | "none";
  notes?: string;
  movements: WorkoutMovement[];
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
  version: number;
}

export interface WorkoutMovement {
  id: string;
  exercise_id: string;
  name: string;
  measure: "reps" | "time" | "distance" | "calories" | "none" | "max_reps";
  value?: number;
  load?: string | number;
  slot?: number;
  rest_s?: number;
  prescription_label?: string;
  notes?: string;
  alternatives?: WorkoutMovementAlternative[];
  series?: WorkoutMovementSeries[];
}

export interface WorkoutMovementAlternative {
  label: string;
  value: number;
  unit: "reps" | "seconds" | "meters" | "calories" | "kg" | "lb";
}

export interface WorkoutMovementSeries {
  reps: string | number;
  load?: string | number;
  rest_s?: string | number;
  cadence?: string | number;
  rpe?: string | number;
}

export type WorkoutPrescription = StrengthPrescription | EndurancePrescription | CrossfitPrescription | HyroxPrescription | CombatPrescription | CompositionalPrescription;

export interface WorkoutSaveInput {
  id?: string;
  /** Obrigatório ao atualizar; omitido ao criar. */
  expected_version?: number;
  idempotency_key: string;
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
  prescription: WorkoutPrescription;
}

export interface WorkoutStepInput {
  id?: string;
  exercise_id?: string;
  title?: string;
  prescription: WorkoutPrescription;
}

export interface WorkoutSummary {
  id: string;
  title: string;
  sport_id: string | null;
  steps: number;
  version: number;
  updated_at: string;
}

const missingEdgeTransport: EdgeTransport = async () => { throw new Error('core.edge_transport_required'); };

export function createApi(call: Transport, invoke: EdgeTransport = missingEdgeTransport) {
  return {
    app: {
      /** Todos os catálogos do app numa leitura. Mande a versão que o app já tem: se nada mudou, vem changed = false e sem catálogos. (query; contract/app/catalogs.v1.json) */
      catalogs: (input: { version?: string } = {}) => call('app_catalogs_v1', { p_version: input.version }) as Promise<CatalogsResponse>,
      /** Grava a telemetria em lote (até 200 eventos). Reenviar não duplica; evento com mais de 7 dias é recusado. (command; contract/app/events_save.v1.json) */
      eventsSave: (input: { events: AppTelemetryEvent[] }) => call('app_events_save_v1', { p_events: input.events }) as Promise<EventsSaved>,
      /** Busca municípios brasileiros sem diferenciar caixa ou acento. (query; contract/app/locations.v1.json) */
      locations: (input: { query?: string | null; stateCode?: string | null; limit?: number } = {}) => call('app_locations_v1', { p_query: input.query, p_state_code: input.stateCode, p_limit: input.limit }) as Promise<AppLocationPage>,
      /** Estado operacional público e sanitizado da plataforma. (query; contract/app/system_status.v1.json) */
      systemStatus: () => invoke('worker', '/app/status', {}) as Promise<SystemStatus>,
      /** Configuração pública e versionada do pré-carregamento de vídeo no Flutter. (query; contract/app/video_preload_settings.v1.json) */
      videoPreloadSettings: () => call('app_video_preload_settings_v1', {}) as Promise<VideoPreloadSettings>,
    },
    commerce: {
      /** Reserva capacidade de anúncio antes do checkout canônico. (command; contract/commerce/ad_book.v1.json) */
      adBook: (input: { businessId: string; packageId: string; idempotencyKey: string }) => call('commerce_ad_book_v1', { p_business_id: input.businessId, p_package_id: input.packageId, p_idempotency_key: input.idempotencyKey }) as Promise<CommerceAdBooking>,
      /** Lista reservas e deriva seu estado do checkout canônico. (query; contract/commerce/ad_bookings.v1.json) */
      adBookings: (input: { businessId: string; limit?: number; offset?: number }) => call('commerce_ad_bookings_v1', { p_business_id: input.businessId, p_limit: input.limit, p_offset: input.offset }) as Promise<CommerceAdBookingPage>,
      /** Lista pacotes publicitários configurados e sua capacidade atual. (query; contract/commerce/ad_packages.v1.json) */
      adPackages: (input: { businessId: string }) => call('commerce_ad_packages_v1', { p_business_id: input.businessId }) as Promise<CommerceAdPackages>,
      /** Lê a entrada do profissional em sua única vertical e os Principais/Associados elegíveis na região. (query; contract/commerce/ambassador.v1.json) */
      ambassador: (input: { countryCode?: string | null; stateCode?: string | null; cityName?: string | null } = {}) => call('commerce_ambassador_v1', { p_country_code: input.countryCode, p_state_code: input.stateCode, p_city_name: input.cityName }) as Promise<CommerceAmbassadorContext>,
      /** Solicita entrada do profissional na rede da própria vertical e região. (command; contract/commerce/ambassador_act.v1.json) */
      ambassadorAct: (input: { countryCode: string; stateCode?: string | null; cityName?: string | null; principalMembershipId?: string | null }) => call('commerce_ambassador_act_v1', { p_country_code: input.countryCode, p_state_code: input.stateCode, p_city_name: input.cityName, p_principal_membership_id: input.principalMembershipId }) as Promise<CommerceAmbassadorMembership>,
      /** Valida criptograficamente uma transação StoreKit e confirma a compra canônica sem confiar no app. (command; contract/commerce/app_store_verify.v1.json) */
      appStoreVerify: (input: { signedTransaction: string; offerId?: string }) => invoke('worker', '/commerce/app-store/verify', { signed_transaction: input.signedTransaction, offer_id: input.offerId }) as Promise<CommerceAppStoreVerification>,
      /** Remove, renomeia ou torna principal um método Stripe pertencente à conta autenticada, com comando durável e idempotente. (command; contract/commerce/card_act.v1.json) */
      cardAct: (input: { command: CommerceCardCommand }) => invoke('worker', '/commerce/card-act', { command: input.command }) as Promise<CommerceCardAction>,
      /** Cria de forma idempotente um SetupIntent para o Stripe Elements; PAN e CVC nunca passam pelo Core. (command; contract/commerce/card_setup.v1.json) */
      cardSetup: (input: { idempotencyKey: string }) => invoke('worker', '/commerce/card-setup', { idempotency_key: input.idempotencyKey }) as Promise<CommerceCardSetup>,
      /** Confirma no servidor o SetupIntent concluído e registra apenas os metadados seguros do cartão tokenizado. (command; contract/commerce/card_setup_complete.v1.json) */
      cardSetupComplete: (input: { setupIntentReference: string; nickname?: string; idempotencyKey: string }) => invoke('worker', '/commerce/card-setup-complete', { setup_intent_reference: input.setupIntentReference, nickname: input.nickname, idempotency_key: input.idempotencyKey }) as Promise<CommercePaymentCard>,
      /** Lista somente os metadados seguros dos cartões tokenizados da conta no Stripe. (query; contract/commerce/cards.v1.json) */
      cards: (input: { cursor?: string; limit?: number } = {}) => invoke('worker', '/commerce/cards', { cursor: input.cursor, limit: input.limit }) as Promise<CommercePaymentCards>,
      /** Estorna exatamente uma cobrança elegível e revoga o direito sustentado por ela. (command; contract/commerce/charge_refund.v1.json) */
      chargeRefund: (input: { chargeId: string; idempotencyKey: string }) => invoke('worker', '/commerce/charge-refund', { charge_id: input.chargeId, idempotency_key: input.idempotencyKey }) as Promise<CommerceChargeRefundResult>,
      /** Congela a oferta e inicia o canal permitido: loja nativa para digital no app, Stripe Elements no desktop ou Pix/Asaas para pagamento externo elegível. (command; contract/commerce/checkout.v1.json) */
      checkout: (input: { offerId: string; channel: "free" | "app_store" | "google_play" | "stripe_card" | "asaas_pix"; storefront?: string | null; idempotencyKey: string; acceptances: CommerceAcceptance[]; returnUrl?: string; physical?: CommercePhysicalCheckoutInput | null }) => invoke('worker', '/commerce/checkout', { offer_id: input.offerId, channel: input.channel, storefront: input.storefront, idempotency_key: input.idempotencyKey, acceptances: input.acceptances, return_url: input.returnUrl, physical: input.physical }) as Promise<CommerceCheckoutResult>,
      /** Página do Clube de um profissional: o que a assinatura libera, preço e o acesso de quem vê. (query; contract/commerce/club.v1.json) */
      club: (input: { professionalId: string }) => call('commerce_club_v1', { p_professional_id: input.professionalId }) as Promise<CommerceClub>,
      /** Prévia de um item da plataforma ligado a uma aula liberada. (query; contract/commerce/course_action.v1.json) */
      courseAction: (input: { courseId: string; lessonId: string; actionId: string }) => call('commerce_course_action_v1', { p_course_id: input.courseId, p_lesson_id: input.lessonId, p_action_id: input.actionId }) as Promise<CommerceCourseAction>,
      /** Link curto para um material de aula liberada: HLS assinado com transcrição para vídeo pronto no Stream, arquivo original nos demais casos. (query; contract/commerce/course_asset.v1.json) */
      courseAsset: (input: { assetId: string; download?: boolean }) => invoke('worker', '/commerce/course-asset', { asset_id: input.assetId, download: input.download }) as Promise<CommerceCourseAsset>,
      /** Prepara e confirma upload privado de asset de curso após validar objeto e vídeo. (command; contract/commerce/course_asset_upload.v1.json) */
      courseAssetUpload: (input: { upload: CommerceCourseAssetUploadInput }) => invoke('worker', '/commerce/course-asset-upload', { upload: input.upload }) as Promise<CommerceCourseAssetUpload>,
      /** Cria, exclui ou denuncia um comentário de aula. (command; contract/commerce/course_comment_act.v1.json) */
      courseCommentAct: (input: { action: "create" | "delete" | "report"; lessonId?: string | null; commentId?: string | null; body?: string | null; parentId?: string | null }) => call('commerce_course_comment_act_v1', { p_action: input.action, p_lesson_id: input.lessonId, p_comment_id: input.commentId, p_body: input.body, p_parent_id: input.parentId }) as Promise<CommerceCourseCommentAction>,
      /** Lista a conversa de uma aula acessível. (query; contract/commerce/course_comments.v1.json) */
      courseComments: (input: { lessonId: string }) => call('commerce_course_comments_v1', { p_lesson_id: input.lessonId }) as Promise<CommerceCourseComments>,
      /** Adiciona item da aula à biblioteca, corrige o quiz e salva ou tira aula dos salvos. Devolve a tela do curso. (command; contract/commerce/course_member_act.v1.json) */
      courseMemberAct: (input: { courseId: string; action: "addToLibrary" | "answerQuiz" | "saveLesson" | "unsaveLesson"; input: CommerceCourseMemberActInput }) => invoke('worker', '/commerce/course-member-act', { course_id: input.courseId, action: input.action, input: input.input }) as Promise<CommerceCourseMemberView>,
      /** Tela do curso e da aula: acesso, bloqueios, progresso, itens da plataforma e quiz sem a resposta. (query; contract/commerce/course_member_detail.v1.json) */
      courseMemberDetail: (input: { courseId: string }) => invoke('worker', '/commerce/course-member-detail', { course_id: input.courseId }) as Promise<CommerceCourseMemberView>,
      /** Adquire, renova ou libera o lease de reprodução de uma aula comprada. (command; contract/commerce/course_playback_act.v1.json) */
      coursePlaybackAct: (input: { lessonId: string; clientId: string; action: "acquire" | "release" }) => call('commerce_course_playback_act_v1', { p_lesson_id: input.lessonId, p_client_id: input.clientId, p_action: input.action }) as Promise<CommerceCoursePlayback>,
      /** Lista cursos do negócio, ligados ou não a uma oferta. (query; contract/commerce/course_studio.v1.json) */
      courseStudio: (input: { businessId: string; status?: string | null; limit?: number; offset?: number }) => call('commerce_course_studio_v1', { p_business_id: input.businessId, p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<CommerceCourseStudio>,
      /** Publica, arquiva ou restaura um curso após validar prontidão. (command; contract/commerce/course_studio_act.v1.json) */
      courseStudioAct: (input: { businessId: string; courseId: string; action: "publish" | "archive" | "restore"; expectedVersion: number; idempotencyKey: string }) => call('commerce_course_studio_act_v1', { p_business_id: input.businessId, p_course_id: input.courseId, p_action: input.action, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<CommerceCourse>,
      /** Lê o curso no estúdio com prontidão, disponibilidade do Clube e os números de alunos, conclusão e quiz. (query; contract/commerce/course_studio_detail.v1.json) */
      courseStudioDetail: (input: { businessId: string; courseId: string }) => call('commerce_course_studio_detail_v1', { p_business_id: input.businessId, p_course_id: input.courseId }) as Promise<CommerceCourseStudioDetail>,
      /** Cria ou salva atomicamente o agregado versionado do curso. (command; contract/commerce/course_studio_save.v1.json) */
      courseStudioSave: (input: { businessId: string; courseId: string | null; offerId: string | null; course: CommerceCourseInput; expectedVersion: number | null; idempotencyKey: string }) => call('commerce_course_studio_save_v1', { p_business_id: input.businessId, p_course_id: input.courseId, p_offer_id: input.offerId, p_course: input.course, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<CommerceCourse>,
      /** Reconsulta o Google Play, vincula a compra à conta autenticada e concede acesso antes do reconhecimento no provedor. (command; contract/commerce/google_play_verify.v1.json) */
      googlePlayVerify: (input: { offerId?: string; productId: string; purchaseToken: string }) => invoke('worker', '/commerce/google-play/verify', { offer_id: input.offerId, product_id: input.productId, purchase_token: input.purchaseToken }) as Promise<CommerceGooglePlayVerification>,
      /** Lista ofertas publicadas e lojas em destaque com filtros e ordenação aplicados pelo Core. (query; contract/commerce/market.v1.json) */
      market: (input: { query?: string | null; type?: string | null; subcategory?: string | null; sort?: "relevance" | "newest" | "popular" | "price_asc" | "price_desc"; limit?: number } = {}) => call('commerce_market_v1', { p_query: input.query, p_type: input.type, p_subcategory: input.subcategory, p_sort: input.sort, p_limit: input.limit }) as Promise<CommerceMarket>,
      /** Área de membros da plataforma: tudo o que a conta acessa, de qualquer profissional, com continuar, salvos e a faixa Em alta. (query; contract/commerce/member_area.v1.json) */
      memberArea: (input: { kind?: "all" | "course" | "video" | "pdf" | "article"; club?: boolean; professionalId?: string | null; query?: string | null; limit?: number; offset?: number } = {}) => invoke('worker', '/commerce/member-area', { kind: input.kind, club: input.club, professional_id: input.professionalId, query: input.query, limit: input.limit, offset: input.offset }) as Promise<CommerceMemberArea>,
      /** Pagina os pedidos físicos da conta autenticada sem expor dados de outros compradores. (query; contract/commerce/my_physical_orders.v1.json) */
      myPhysicalOrders: (input: { cursor?: string | null; limit?: number } = {}) => call('commerce_my_physical_orders_v1', { p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommerceMyPhysicalOrders>,
      /** Resolve produto nativo e preço da oferta digital publicada. Na Apple ACA, storefront é obrigatório e o preço é do Core, não do placeholder genérico. (query; contract/commerce/native_product.v1.json) */
      nativeProduct: (input: { offerId: string; channel: "app_store" | "google_play"; storefront?: string | null }) => call('commerce_native_product_v1', { p_offer_id: input.offerId, p_channel: input.channel, p_storefront: input.storefront }) as Promise<CommerceNativeProduct>,
      /** Lê uma oferta pública ou administrada. (query; contract/commerce/offer.v1.json) */
      offer: (input: { offerId: string }) => call('commerce_offer_v1', { p_offer_id: input.offerId }) as Promise<CommerceOffer>,
      /** Publica, pausa, retoma ou arquiva uma oferta. (command; contract/commerce/offer_act.v1.json) */
      offerAct: (input: { offerId: string; action: "ready" | "publish" | "pause" | "resume" | "archive"; expectedVersion: number }) => call('commerce_offer_act_v1', { p_offer_id: input.offerId, p_action: input.action, p_expected_version: input.expectedVersion }) as Promise<CommerceOffer>,
      /** Lê o modelo profissional ligado à entrega de uma oferta avulsa. (query; contract/commerce/offer_delivery.v1.json) */
      offerDelivery: (input: { offerId: string }) => call('commerce_offer_delivery_v1', { p_offer_id: input.offerId }) as Promise<CommerceOfferDelivery>,
      /** Liga uma oferta avulsa ao modelo profissional entregue ao comprador. (command; contract/commerce/offer_delivery_save.v1.json) */
      offerDeliverySave: (input: { offerId: string; resourceId: string; expectedVersion: number | null; idempotencyKey: string }) => call('commerce_offer_delivery_save_v1', { p_offer_id: input.offerId, p_resource_id: input.resourceId, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<CommerceOfferDelivery>,
      /** Aquisições da oferta, somente para o dono do negócio; identidade pública do comprador, valor, situação e data, sem vínculo clínico. Ordenação decrescente por data e ID, páginas de 1 a 50 itens (padrão 30). (query; contract/commerce/offer_sales.v1.json) */
      offerSales: (input: { offerId: string; cursor?: string | null; limit?: number }) => call('commerce_offer_sales_v1', { p_offer_id: input.offerId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommerceOfferSales>,
      /** Cria ou altera qualquer oferta segundo seu tipo configurado. (command; contract/commerce/offer_save.v1.json) */
      offerSave: (input: { offer: CommerceOfferSaveInput }) => call('commerce_offer_save_v1', { p_offer: input.offer }) as Promise<CommerceOffer>,
      /** Liga ou desliga uma ferramenta da oferta com concorrência otimista. (command; contract/commerce/offering_tool_save.v1.json) */
      offeringToolSave: (input: { offerId: string; toolKey: string; enabled: boolean; expectedVersion: number; idempotencyKey: string }) => call('commerce_offering_tool_save_v1', { p_offer_id: input.offerId, p_tool_key: input.toolKey, p_enabled: input.enabled, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<CommerceOfferingTool>,
      /** Lê o catálogo e a seleção de ferramentas de uma oferta. (query; contract/commerce/offering_tools.v1.json) */
      offeringTools: (input: { offerId: string }) => call('commerce_offering_tools_v1', { p_offer_id: input.offerId }) as Promise<CommerceOfferingTools>,
      /** Lista ofertas geridas por um negócio. (query; contract/commerce/offers.v1.json) */
      offers: (input: { businessId: string; status?: string | null }) => call('commerce_offers_v1', { p_business_id: input.businessId, p_status: input.status }) as Promise<CommerceOffers>,
      /** Avança ou corrige a operação de um pedido físico com concorrência e idempotência. (command; contract/commerce/order_act.v1.json) */
      orderAct: (input: { command: CommercePhysicalOrderCommand }) => call('commerce_order_act_v1', { p_command: input.command }) as Promise<CommercePhysicalOrder>,
      /** Pesquisa e pagina pedidos físicos de um negócio ou oferta. (query; contract/commerce/orders.v1.json) */
      orders: (input: { businessId: string; offerId?: string | null; status?: "awaiting_payment" | "payment_failed" | "confirmed" | "preparing" | "shipped" | "ready_for_pickup" | "delivered" | "cancelled" | "refunded" | "review" | null; query?: string | null; cursor?: string | null; limit?: number }) => call('commerce_orders_v1', { p_business_id: input.businessId, p_offer_id: input.offerId, p_status: input.status, p_query: input.query, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommerceOrders>,
      /** Lista cobranças do negócio sem dados secretos do meio de pagamento. (query; contract/commerce/payments.v1.json) */
      payments: (input: { businessId: string; cursor?: string | null; limit?: number }) => call('commerce_payments_v1', { p_business_id: input.businessId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommercePayments>,
      /** Registra um pedido de repasse para revisão operacional, reservando saldo sem persistir o destino em claro nem simular liquidação externa. (command; contract/commerce/payout.v1.json) */
      payout: (input: { businessId: string; amount: number; currency: string; destination: CommercePayoutDestination; idempotencyKey: string }) => call('commerce_payout_v1', { p_business_id: input.businessId, p_amount: input.amount, p_currency: input.currency, p_destination: input.destination, p_idempotency_key: input.idempotencyKey }) as Promise<CommercePayout>,
      /** Lista o catálogo físico administrado, métricas e vendas sem acesso direto às tabelas. (query; contract/commerce/physical_catalog.v1.json) */
      physicalCatalog: (input: { offerId: string; status?: "draft" | "active" | "paused" | "archived" | "all" | null; from?: string | null; to?: string | null; cursor?: string | null; limit?: number }) => call('commerce_physical_catalog_v1', { p_offer_id: input.offerId, p_status: input.status, p_from: input.from, p_to: input.to, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommercePhysicalCatalog>,
      /** Pagina o histórico imutável de estoque de um produto físico. (query; contract/commerce/physical_inventory.v1.json) */
      physicalInventory: (input: { productId: string; cursor?: string | null; limit?: number }) => call('commerce_physical_inventory_v1', { p_product_id: input.productId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommercePhysicalInventory>,
      /** Pesquisa e pagina somente produtos físicos ativos e compráveis. (query; contract/commerce/physical_market.v1.json) */
      physicalMarket: (input: { query?: string | null; categoryKey?: string | null; cursor?: string | null; limit?: number } = {}) => call('commerce_physical_market_v1', { p_query: input.query, p_category_key: input.categoryKey, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommercePhysicalMarket>,
      /** Define capa, remove ou reordena mídia pertencente ao produto. (command; contract/commerce/physical_media_act.v1.json) */
      physicalMediaAct: (input: { command: CommercePhysicalMediaCommand }) => call('commerce_physical_media_act_v1', { p_command: input.command }) as Promise<CommercePhysicalProduct>,
      /** Prepara ou confirma upload R2 de mídia de produto, validando objeto e ownership no servidor. (command; contract/commerce/physical_media_upload.v1.json) */
      physicalMediaUpload: (input: { upload: CommercePhysicalMediaUploadInput }) => invoke('worker', '/commerce/physical-media-upload', { upload: input.upload }) as Promise<CommercePhysicalMediaUpload>,
      /** Lê detalhe e opções atuais de entrega de um produto físico comprável. (query; contract/commerce/physical_product.v1.json) */
      physicalProduct: (input: { productId: string }) => call('commerce_physical_product_v1', { p_product_id: input.productId }) as Promise<CommercePhysicalBuyerItem>,
      /** Arquiva, restaura, duplica ou ajusta estoque com concorrência e idempotência. (command; contract/commerce/physical_product_act.v1.json) */
      physicalProductAct: (input: { command: CommercePhysicalProductCommand }) => call('commerce_physical_product_act_v1', { p_command: input.command }) as Promise<CommercePhysicalProduct>,
      /** Cria ou altera atomicamente um produto físico e suas regras de estoque e entrega. (command; contract/commerce/physical_product_save.v1.json) */
      physicalProductSave: (input: { product: CommercePhysicalProductInput }) => call('commerce_physical_product_save_v1', { p_product: input.product }) as Promise<CommercePhysicalProduct>,
      /** Calcula total e entrega a partir do estoque e frete atuais, sem criar reserva. (query; contract/commerce/physical_quote.v1.json) */
      physicalQuote: (input: { productId: string; quantity: number; shippingMethod: "shipping" | "pickup"; stateCode?: string | null }) => call('commerce_physical_quote_v1', { p_product_id: input.productId, p_quantity: input.quantity, p_shipping_method: input.shippingMethod, p_state_code: input.stateCode }) as Promise<CommercePhysicalQuote>,
      /** Salva o progresso de um componente da aula, liberada, no curso da conta e devolve a conclusão decidida pelo servidor. (command; contract/commerce/progress_save.v1.json) */
      progressSave: (input: { courseId: string; progress: CommerceProgressInput }) => call('commerce_progress_save_v1', { p_course_id: input.courseId, p_progress: input.progress }) as Promise<CommerceProgressResult>,
      /** Lista ofertas promovidas em uma posição cuja reserva foi aprovada pela staff e está vigente. (query; contract/commerce/promoted_offers.v1.json) */
      promotedOffers: (input: { placement: "sponsor_carousel" | "featured_products"; sessionSeed: string }) => call('commerce_promoted_offers_v1', { p_placement: input.placement, p_session_seed: input.sessionSeed }) as Promise<CommercePromotedOffers>,
      /** Lê compra, entrega, progresso e cobranças autorizadas. (query; contract/commerce/purchase.v1.json) */
      purchase: (input: { purchaseId: string }) => call('commerce_purchase_v1', { p_purchase_id: input.purchaseId }) as Promise<CommercePurchase>,
      /** Pesquisa e pagina o histórico canônico de compras do titular. (query; contract/commerce/purchases.v1.json) */
      purchases: (input: { status?: string | null; query?: string | null; filter?: "all" | "contents" | "workouts" | "diets" | "consultancies" | "products" | null; cursor?: string | null; limit?: number } = {}) => call('commerce_purchases_v1', { p_status: input.status, p_query: input.query, p_filter: input.filter, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommercePurchases>,
      /** Lê elegibilidade e resumo de avaliações de uma oferta. (query; contract/commerce/review_context.v1.json) */
      reviewContext: (input: { offerId: string }) => call('commerce_review_context_v1', { p_offer_id: input.offerId }) as Promise<CommerceReviewContext>,
      /** Denuncia avaliação de forma idempotente para moderação. (command; contract/commerce/review_report.v1.json) */
      reviewReport: (input: { reviewId: string; reason: "spam" | "abuse" | "fraud" | "privacy" | "misinformation" | "other"; idempotencyKey: string }) => call('commerce_review_report_v1', { p_review_id: input.reviewId, p_reason: input.reason, p_idempotency_key: input.idempotencyKey }) as Promise<CommerceReviewReport>,
      /** Cria ou atualiza a avaliação da própria compra confirmada. (command; contract/commerce/review_save.v1.json) */
      reviewSave: (input: { purchaseId: string; rating: number; comment?: string | null; expectedVersion?: number | null }) => call('commerce_review_save_v1', { p_purchase_id: input.purchaseId, p_rating: input.rating, p_comment: input.comment, p_expected_version: input.expectedVersion }) as Promise<CommerceReview>,
      /** Pagina avaliações publicadas de uma oferta. (query; contract/commerce/reviews.v1.json) */
      reviews: (input: { offerId: string; cursor?: string | null; limit?: number }) => call('commerce_reviews_v1', { p_offer_id: input.offerId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommerceReviews>,
      /** Lista, com paginação estável, as ofertas públicas de um único negócio. (query; contract/commerce/storefront_offers.v1.json) */
      storefrontOffers: (input: { businessId: string; cursor?: string | null; limit?: number }) => call('commerce_storefront_offers_v1', { p_business_id: input.businessId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<CommerceStorefrontOffers>,
      /** Solicita cancelamento durável de recorrência não-consultoria; Apple conserva o período pago e os demais provedores encerram o direito após confirmação. (command; contract/commerce/subscription_cancel.v1.json) */
      subscriptionCancel: (input: { subscriptionId: string; idempotencyKey: string }) => call('commerce_subscription_cancel_v1', { p_subscription_id: input.subscriptionId, p_idempotency_key: input.idempotencyKey }) as Promise<CommerceSubscriptionCancelResult>,
      /** Solicita ao provedor uma nova tentativa segura para a cobrança vencida da própria recorrência. (command; contract/commerce/subscription_recover.v1.json) */
      subscriptionRecover: (input: { subscriptionId: string; idempotencyKey: string }) => invoke('worker', '/commerce/subscription-recover', { subscription_id: input.subscriptionId, idempotency_key: input.idempotencyKey }) as Promise<CommerceSubscriptionRecoveryResult>,
      /** Consulta saldos derivados do razão e repasses. (query; contract/commerce/wallet.v1.json) */
      wallet: (input: { businessId: string }) => call('commerce_wallet_v1', { p_business_id: input.businessId }) as Promise<CommerceWallet>,
    },
    health: {
      /** Lista conversas privadas, mensagens da conversa selecionada e uso do assistente. (query; contract/health/assistant.v1.json) */
      assistant: (input: { conversationId?: string; cursor?: string; limit?: number } = {}) => call('health_assistant_v1', { p_conversation_id: input.conversationId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<HealthAssistant>,
      /** Arquiva uma conversa privada do próprio titular. (command; contract/health/assistant_act.v1.json) */
      assistantAct: (input: { conversationId: string; action: "archive" }) => call('health_assistant_act_v1', { p_conversation_id: input.conversationId, p_action: input.action }) as Promise<HealthAssistantActionResult>,
      /** Pergunta ao assistente não diagnóstico usando apenas o histórico da conversa. (command; contract/health/assistant_ask.v1.json) */
      assistantAsk: (input: { conversationId?: string; message: string }) => invoke('worker', '/health/assistant', { conversation_id: input.conversationId, message: input.message }) as Promise<HealthAssistantReply>,
      /** Ajuda o profissional a interpretar a ficha consentida sem diagnosticar nem prescrever. (command; contract/health/client_assistant_ask.v1.json) */
      clientAssistantAsk: (input: { businessId: string; clientId: string; message: string; history?: HealthClientAssistantHistoryMessage[] }) => invoke('worker', '/health/client-assistant', { business_id: input.businessId, client_id: input.clientId, message: input.message, history: input.history }) as Promise<HealthClientAssistantReply>,
      /** Dossiê consentido do cliente para profissional autorizado. (query; contract/health/client_record.v1.json) */
      clientRecord: (input: { businessId: string; clientId: string; from?: string; to?: string }) => call('health_client_record_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_from: input.from, p_to: input.to }) as Promise<HealthClientRecord>,
      /** Registra uma decisão pessoal de privacidade de Saúde. (command; contract/health/consent_act.v1.json) */
      consentAct: (input: { purpose: "profile_storage" | "ai_assistance"; action: "granted" | "revoked"; policyVersion: string }) => call('health_consent_act_v1', { p_purpose: input.purpose, p_action: input.action, p_policy_version: input.policyVersion }) as Promise<HealthConsent>,
      /** Lê as decisões pessoais de privacidade de Saúde. (query; contract/health/consents.v1.json) */
      consents: () => call('health_consents_v1', {}) as Promise<HealthConsents>,
      /** Extrai uma proposta revisável de um documento privado de saúde. (command; contract/health/document_process.v1.json) */
      documentProcess: (input: { documentId: string }) => invoke('worker', '/health/document-process', { document_id: input.documentId }) as Promise<HealthDocumentProcessResult>,
      /** Lê um evento pessoal de saúde. (query; contract/health/event.v1.json) */
      event: (input: { id: string }) => call('health_event_v1', { p_id: input.id }) as Promise<HealthEvent>,
      /** Exclui um evento pessoal de saúde. (command; contract/health/event_act.v1.json) */
      eventAct: (input: { id: string; action: "delete" }) => call('health_event_act_v1', { p_id: input.id, p_action: input.action }) as Promise<HealthEventDeleteResult>,
      /** Registra ou corrige um evento pessoal de saúde. (command; contract/health/event_save.v1.json) */
      eventSave: (input: { event: HealthEventInput }) => call('health_event_save_v1', { p_event: input.event }) as Promise<HealthEvent>,
      /** Abre arquivo de saúde por URL assinada curta. (query; contract/health/file.v1.json) */
      file: (input: { id: string }) => invoke('worker', '/health/file', { id: input.id }) as Promise<HealthFileAccess>,
      /** Exclui um anexo de Saúde ainda não usado por um registro. (command; contract/health/file_act.v1.json) */
      fileAct: (input: { id: string; action: "delete" }) => call('health_file_act_v1', { p_id: input.id, p_action: input.action }) as Promise<HealthFileDeleteResult>,
      /** Abre questionário atribuído ou link público. (query; contract/health/form.v1.json) */
      form: (input: { questionnaireId?: string; token?: string } = {}) => call('health_form_v1', { p_questionnaire_id: input.questionnaireId, p_token: input.token }) as Promise<HealthForm>,
      /** Salva rascunho ou envia resposta na versão recebida. (command; contract/health/form_save.v1.json) */
      formSave: (input: { responseId: string; token?: string; answers: HealthAnswersInput; submit: boolean; expectedVersion: number; idempotencyKey: string }) => call('health_form_save_v1', { p_response_id: input.responseId, p_token: input.token, p_answers: input.answers, p_submit: input.submit, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<HealthForm>,
      /** Painel privado de Saúde no período, incluindo o histórico unificado de atividades. (query; contract/health/home.v1.json) */
      home: (input: { from?: string; to?: string } = {}) => call('health_home_v1', { p_from: input.from, p_to: input.to }) as Promise<HealthHome>,
      /** Lista formulários ativos que a pessoa autenticada ainda deve preencher. (query; contract/health/pending_forms.v1.json) */
      pendingForms: () => call('health_pending_forms_v1', {}) as Promise<HealthPendingForms>,
      /** Confirma os metadados de uma foto de evolução pertencente ao próprio cliente. (command; contract/health/progress_photo_save.v1.json) */
      progressPhotoSave: (input: { photo: HealthProgressPhotoInput }) => call('health_progress_photo_save_v1', { p_photo: input.photo }) as Promise<HealthFileSummary>,
      /** Salva modelo; edição respondida cria nova versão. (command; contract/health/questionnaire_save.v1.json) */
      questionnaireSave: (input: { questionnaire: HealthQuestionnaireSaveInput }) => call('health_questionnaire_save_v1', { p_questionnaire: input.questionnaire }) as Promise<HealthQuestionnaireSaved>,
      /** Modelos, entregas e respostas do negócio. (query; contract/health/questionnaires.v1.json) */
      questionnaires: (input: { businessId: string }) => call('health_questionnaires_v1', { p_business_id: input.businessId }) as Promise<HealthQuestionnaires>,
      /** Salva relatório; publicado vira versão imutável. (command; contract/health/report_save.v1.json) */
      reportSave: (input: { report: HealthReportSaveInput }) => call('health_report_save_v1', { p_report: input.report }) as Promise<HealthReport>,
      /** Marca uma resposta enviada como revisada pelo profissional autorizado. (command; contract/health/response_act.v1.json) */
      responseAct: (input: { id: string; action: "review" }) => call('health_response_act_v1', { p_id: input.id, p_action: input.action }) as Promise<HealthBusinessResponse>,
      /** Lê a versão atual da anamnese pessoal. (query; contract/health/self_questionnaire.v1.json) */
      selfQuestionnaire: () => call('health_self_questionnaire_v1', {}) as Promise<HealthSelfQuestionnaire>,
      /** Envia uma nova versão da anamnese pessoal. (command; contract/health/self_questionnaire_submit.v1.json) */
      selfQuestionnaireSubmit: (input: { questionnaireId: string; expectedVersion: number; answers: HealthAnswersInput; idempotencyKey: string }) => call('health_self_questionnaire_submit_v1', { p_questionnaire_id: input.questionnaireId, p_expected_version: input.expectedVersion, p_answers: input.answers, p_idempotency_key: input.idempotencyKey }) as Promise<HealthQuestionnaireSubmission>,
      /** Prepara e confirma upload assinado no R2 privado. (command; contract/health/upload.v1.json) */
      upload: (input: { file: HealthUploadInput; kind: "health_document" | "progress_photo" }) => invoke('worker', '/health/upload', { file: input.file, kind: input.kind }) as Promise<HealthUpload>,
      /** Lê a conexão e os agregados recentes de um provedor de saúde. (query; contract/health/wearable.v1.json) */
      wearable: (input: { provider: "apple_health" | "health_connect" }) => call('health_wearable_v1', { p_provider: input.provider }) as Promise<HealthWearable>,
      /** Sincroniza agregados diários de Apple Saúde ou Health Connect. (command; contract/health/wearable_sync.v1.json) */
      wearableSync: (input: { sync: HealthWearableSyncInput }) => call('health_wearable_sync_v1', { p_sync: input.sync }) as Promise<HealthWearableSyncResult>,
    },
    identity: {
      /** Carrega a identidade autenticada completa e tipada. (query; contract/identity/bootstrap.v1.json) */
      bootstrap: () => call('identity_bootstrap_v1', {}) as Promise<IdentityBootstrap>,
      /** Exclui a própria conta e agenda a remoção segura dos seus arquivos externos. (command; contract/identity/delete.v1.json) */
      delete: () => invoke('auth', '/delete', {}) as Promise<IdentityDeleteResult>,
      /** register grava o aparelho só quando o token muda (e tira o token de outra conta); remove tira o token no logout. (command; contract/identity/device_act.v1.json) */
      deviceAct: (input: { action: "register" | "remove"; token: string; platform?: "ios" | "android" | "web"; deviceId?: string }) => call('identity_device_act_v1', { p_action: input.action, p_token: input.token, p_platform: input.platform, p_device_id: input.deviceId }) as Promise<Devices>,
      /** Guarda o CPF cifrado e devolve somente sua situação segura. (command; contract/identity/document_save.v1.json) */
      documentSave: (input: { document: string }) => call('identity_document_save_v1', { p_document: input.document }) as Promise<IdentityBootstrap>,
      /** Documentos legais vigentes e termos das consultorias da própria conta, com a prova de aceite. (query; contract/identity/legal_center.v1.json) */
      legalCenter: () => call('identity_legal_center_v1', {}) as Promise<LegalCenter>,
      /** Documentos legais vigentes, para o cadastro (antes do login). (query; contract/identity/legal_documents.v1.json) */
      legalDocuments: () => call('identity_legal_documents_v1', {}) as Promise<LegalDocument[]>,
      /** Conclui objetivo, nascimento, nível, interesses e aceites na mesma transação. (command; contract/identity/onboarding_save.v1.json) */
      onboardingSave: (input: { onboarding: IdentityOnboardingSaveInput }) => call('identity_onboarding_save_v1', { p_onboarding: input.onboarding }) as Promise<IdentityBootstrap>,
      /** Executa um comando fechado do cadastro anterior ao login usando token opaco. (command; contract/identity/pending_act.v1.json) */
      pendingAct: (input: { command: IdentityPendingCommand }) => invoke('auth', '/pending', { command: input.command }) as Promise<IdentityPendingResult>,
      /** Lê a especialidade e a credencial profissional da própria conta, incluindo o estado da revisão. (query; contract/identity/professional_settings.v1.json) */
      professionalSettings: () => call('identity_professional_settings_v1', {}) as Promise<ProfessionalSettings>,
      /** Envia a credencial profissional para revisão usando uma especialidade configurada no backoffice. (command; contract/identity/professional_settings_save.v1.json) */
      professionalSettingsSave: (input: { specialty: string; jurisdiction: string; registration: string }) => call('identity_professional_settings_save_v1', { p_specialty: input.specialty, p_jurisdiction: input.jurisdiction, p_registration: input.registration }) as Promise<ProfessionalSettings>,
      /** Salva blocos tipados do perfil em uma transação e devolve o bootstrap atualizado. (command; contract/identity/profile_save.v1.json) */
      profileSave: (input: { profile: IdentityProfilePatch }) => call('identity_profile_save_v1', { p_profile: input.profile }) as Promise<IdentityBootstrap>,
      /** Solicita a recuperação de senha sem revelar se o e-mail possui conta no Core. (command; contract/identity/recover.v1.json) */
      recover: (input: { email: string }) => invoke('auth', '/recover', { email: input.email }) as Promise<IdentityRecoveryResult>,
      /** Entra com e-mail ou @usuário sem expor o endereço resolvido quando a credencial é inválida. (command; contract/identity/sign_in.v1.json) */
      signIn: (input: { identifier: string; password: string }) => invoke('auth', '/sign-in', { identifier: input.identifier, password: input.password }) as Promise<IdentitySignInResult>,
      /** Cria a conta no Core, valida idade e aceites vigentes e inicia a confirmação de e-mail. (command; contract/identity/sign_up.v1.json) */
      signUp: (input: { email: string; password: string; fullName: string; username: string; birthDate: string; acceptances: IdentityAcceptance[] }) => invoke('auth', '/sign-up', { email: input.email, password: input.password, full_name: input.fullName, username: input.username, birth_date: input.birthDate, acceptances: input.acceptances }) as Promise<IdentitySignUpResult>,
    },
    nutrition: {
      /** Calendário de Nutrição (J16.57/58): por dia, refeições previstas, feitas, não feitas e refeições livres. (query; contract/nutrition/calendar.v1.json) */
      calendar: (input: { from: string; to: string }) => call('nutrition_calendar_v1', { p_from: input.from, p_to: input.to }) as Promise<NutritionCalendarDay[]>,
      /** Lista coleções curadas de alimentos autorizadas para a conta. (query; contract/nutrition/catalog_collections.v1.json) */
      catalogCollections: (input: { query?: string | null; limit?: number; offset?: number } = {}) => call('nutrition_catalog_collections_v1', { p_query: input.query, p_limit: input.limit, p_offset: input.offset }) as Promise<NutritionCatalogCollectionPage>,
      /** Lê dieta ativa, histórico e adesão diária do cliente autorizado. (query; contract/nutrition/client_diet.v1.json) */
      clientDiet: (input: { businessId: string; clientId: string; from?: string; to?: string }) => call('nutrition_client_diet_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_from: input.from, p_to: input.to }) as Promise<NutritionClientDiet>,
      /** Publica, substitui, arquiva ou restaura uma dieta prescrita. (command; contract/nutrition/client_diet_act.v1.json) */
      clientDietAct: (input: { businessId: string; clientId: string; dietId: string; action: "publish" | "replace" | "archive" | "restore"; expectedVersion: number; idempotencyKey: string }) => call('nutrition_client_diet_act_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_diet_id: input.dietId, p_action: input.action, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<NutritionProfessionalDiet>,
      /** Cria ou salva o rascunho de dieta prescrita de um cliente autorizado. (command; contract/nutrition/client_diet_save.v1.json) */
      clientDietSave: (input: { businessId: string; clientId: string; dietId: string | null; sourceDietId: string | null; title: string | null; objective: string | null; meals: NutritionDietMealInput[]; expectedVersion: number | null; idempotencyKey: string }) => call('nutrition_client_diet_save_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_diet_id: input.dietId, p_source_diet_id: input.sourceDietId, p_title: input.title, p_objective: input.objective, p_meals: input.meals, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<NutritionProfessionalDiet>,
      /** O dia de Nutrição: dieta ativa, marcação e edição de cada refeição no dia e refeições livres. (query; contract/nutrition/day.v1.json) */
      day: (input: { date?: string } = {}) => call('nutrition_day_v1', { p_date: input.date }) as Promise<NutritionDay>,
      /** apply (ativa; da OnlyFit Health cria a cópia uma vez, J16.50/88) · remove (tira da biblioteca) · mealTime (horário, J16.52). Devolve a biblioteca. (command; contract/nutrition/diet_act.v1.json) */
      dietAct: (input: { dietId: string; action: "apply" | "remove" | "mealTime"; input?: DietActionInput }) => call('nutrition_diet_act_v1', { p_diet_id: input.dietId, p_action: input.action, p_input: input.input }) as Promise<DietLibrary>,
      /** Gera ou ajusta uma proposta estruturada de dieta para revisão profissional obrigatória. (command; contract/nutrition/diet_assistant.v1.json) */
      dietAssistant: (input: { businessId: string; clientId: string | null; mode: "generate" | "adjust"; instruction: string; currentDiet?: NutritionDietProposalInput }) => invoke('worker', '/nutrition/diet-assistant', { business_id: input.businessId, client_id: input.clientId, mode: input.mode, instruction: input.instruction, current_diet: input.currentDiet }) as Promise<NutritionDietAssistantResult>,
      /** Salva a dieta própria ou personaliza a cópia comprada, sem alterar o conteúdo adquirido ou o template. Metas somadas dos itens. (command; contract/nutrition/diet_save.v1.json) */
      dietSave: (input: { diet: DietSaveInput }) => call('nutrition_diet_save_v1', { p_diet: input.diet }) as Promise<Diet>,
      /** Cria, altera ou remove alimento pessoal validado. (command; contract/nutrition/food_save.v1.json) */
      foodSave: (input: { food: FoodSaveInput }) => call('nutrition_food_save_v1', { p_food: input.food }) as Promise<NutritionFoodSaveResult>,
      /** Busca de alimentos: começo do nome e bases comuns (TACO, TBCA) primeiro; pessoais só para quem criou; código de barras exato. (query; contract/nutrition/food_search.v1.json) */
      foodSearch: (input: { query?: string; barcode?: string; limit?: number; offset?: number } = {}) => call('nutrition_food_search_v1', { p_query: input.query, p_barcode: input.barcode, p_limit: input.limit, p_offset: input.offset }) as Promise<NutritionFood[]>,
      /** Refeição livre (J16.37–40): já consumida, só o título é obrigatório, sem horário inventado; criar, editar e excluir só hoje e ontem. Devolve o dia. (command; contract/nutrition/free_meal_save.v1.json) */
      freeMealSave: (input: { meal: FreeMealInput }) => call('nutrition_free_meal_save_v1', { p_meal: input.meal }) as Promise<NutritionDay>,
      /** Biblioteca de dietas: própria, comprada, prescrita e OnlyFit Health (ler não cria cópia), com a ativa. (query; contract/nutrition/library.v1.json) */
      library: () => call('nutrition_library_v1', {}) as Promise<DietLibrary>,
      /** mark (feito | não feito com motivo, J16.22) · unmark — hoje e ontem; edit/remove só neste dia (J16.67), qualquer data. Devolve o dia. (command; contract/nutrition/meal_act.v1.json) */
      mealAct: (input: { mealId: string; action: "mark" | "unmark" | "edit" | "remove" | "removePhoto"; date?: string; input?: MealActionInput }) => call('nutrition_meal_act_v1', { p_meal_id: input.mealId, p_action: input.action, p_date: input.date, p_input: input.input }) as Promise<NutritionDay>,
      /** Descarta uma foto nutricional própria que ainda não foi vinculada a uma refeição. (command; contract/nutrition/photo_act.v1.json) */
      photoAct: (input: { fileId: string; action: "delete" }) => call('nutrition_photo_act_v1', { p_file_id: input.fileId, p_action: input.action }) as Promise<NutritionPhotoDeleteResult>,
      /** Gera por cinco minutos a leitura de uma foto nutricional privada visível à conta. (query; contract/nutrition/photo_file.v1.json) */
      photoFile: (input: { fileId: string }) => invoke('worker', '/nutrition/photo-file', { file_id: input.fileId }) as Promise<NutritionPhotoFile>,
      /** Prepara ou confirma uma foto privada de refeição, com ownership e contrato do objeto validados no servidor. (command; contract/nutrition/photo_upload.v1.json) */
      photoUpload: (input: { photo: NutritionPhotoUploadInput }) => invoke('worker', '/nutrition/photo-upload', { photo: input.photo }) as Promise<NutritionPhotoUpload>,
      /** Publica, arquiva ou restaura um modelo de dieta do negócio. (command; contract/nutrition/professional_diet_act.v1.json) */
      professionalDietAct: (input: { businessId: string; dietId: string; action: "publish" | "archive" | "restore"; expectedVersion: number; idempotencyKey: string }) => call('nutrition_professional_diet_act_v1', { p_business_id: input.businessId, p_diet_id: input.dietId, p_action: input.action, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<NutritionProfessionalDiet>,
      /** Cria ou salva um modelo de dieta versionado do negócio. Rascunhos podem começar sem refeições; conteúdo publicado não pode ser esvaziado. (command; contract/nutrition/professional_diet_save.v1.json) */
      professionalDietSave: (input: { businessId: string; dietId: string | null; title: string; objective: string; meals: NutritionDietMealInput[]; expectedVersion: number | null; idempotencyKey: string }) => call('nutrition_professional_diet_save_v1', { p_business_id: input.businessId, p_diet_id: input.dietId, p_title: input.title, p_objective: input.objective, p_meals: input.meals, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<NutritionProfessionalDiet>,
      /** Lista modelos de dieta compartilhados pela equipe do negócio. (query; contract/nutrition/professional_library.v1.json) */
      professionalLibrary: (input: { businessId: string; status?: "all" | "draft" | "published" | "archived" | null; limit?: number; offset?: number }) => call('nutrition_professional_library_v1', { p_business_id: input.businessId, p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<NutritionProfessionalLibrary>,
    },
    org: {
      /** Lista os negócios, compõe perfil e equipe e pesquisa profissionais elegíveis para convite. (query; contract/org/business.v1.json) */
      business: (input: { businessId?: string; search?: string } = {}) => call('org_business_v1', { p_business_id: input.businessId, p_search: input.search }) as Promise<BusinessScreen>,
      /** Publica, pausa, retoma, arquiva, restaura, exclui ou reenvia um negócio. (command; contract/org/business_act.v1.json) */
      businessAct: (input: { businessId: string; action: "publish" | "pause" | "resume" | "archive" | "restore" | "delete" | "resubmit" }) => call('org_business_act_v1', { p_business_id: input.businessId, p_action: input.action }) as Promise<BusinessActionResult>,
      /** Cria ou substitui atomicamente o perfil inteiro do negócio. (command; contract/org/business_save.v1.json) */
      businessSave: (input: { business: BusinessSaveInput }) => call('org_business_save_v1', { p_business: input.business }) as Promise<BusinessSaveResult>,
      /** Cria uma tarefa de cuidado para um cliente real do negócio. (command; contract/org/care_task_create.v1.json) */
      careTaskCreate: (input: { businessId: string; clientId: string; kind: "handoff" | "intervention" | "observation" | "follow_up"; title: string; detail: string | null; priority: "low" | "medium" | "high" | "urgent"; target: "nutritionist" | "personal_trainer" | "hybrid_professional" | "student" | "shared"; source: "manual" | "suggested" | "automation"; contextTag: string | null; dueAt: string | null; idempotencyKey: string }) => call('org_care_task_create_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_kind: input.kind, p_title: input.title, p_detail: input.detail, p_priority: input.priority, p_target: input.target, p_source: input.source, p_context_tag: input.contextTag, p_due_at: input.dueAt, p_idempotency_key: input.idempotencyKey }) as Promise<OrgCareTask>,
      /** Altera o estado de uma tarefa com concorrência otimista. (command; contract/org/care_task_status.v1.json) */
      careTaskStatus: (input: { businessId: string; clientId: string; taskId: string; status: "open" | "in_progress" | "done"; expectedVersion: number; idempotencyKey: string }) => call('org_care_task_status_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_task_id: input.taskId, p_status: input.status, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<OrgCareTask>,
      /** Lista tarefas de cuidado visíveis à equipe do negócio. (query; contract/org/care_tasks.v1.json) */
      careTasks: (input: { businessId: string; clientIds?: string[] | null; clientId?: string | null; includeDone?: boolean; limit?: number }) => call('org_care_tasks_v1', { p_business_id: input.businessId, p_client_ids: input.clientIds, p_client_id: input.clientId, p_include_done: input.includeDone, p_limit: input.limit }) as Promise<OrgCareTaskPage>,
      /** Entrega conteúdo, pedidos, cobrança e atividade comercial autorizados do cliente. (query; contract/org/client_commercial.v1.json) */
      clientCommercial: (input: { clientId: string }) => call('org_client_commercial_v1', { p_client_id: input.clientId }) as Promise<OrgClientCommercial>,
      /** Lista a trilha de consentimento com documento e versão apresentados. (query; contract/org/client_consent_trail.v1.json) */
      clientConsentTrail: (input: { clientId: string }) => call('org_client_consent_trail_v1', { p_client_id: input.clientId }) as Promise<OrgClientConsentTrailEvent[]>,
      /** Abre a ficha única do cliente em todos os negócios autorizados. (query; contract/org/client_workspace.v1.json) */
      clientWorkspace: (input: { clientId: string }) => call('org_client_workspace_v1', { p_client_id: input.clientId }) as Promise<OrgCrmWorkspace>,
      /** Permite ao titular autorizar, negar ou revogar itens de acesso do contrato de consultoria. (command; contract/org/consent_decide.v1.json) */
      consentDecide: (input: { contractId: string; action: "allow" | "deny" | "revoke"; items: ("training" | "diet" | "protocols" | "health")[]; expectedVersion: number; idempotencyKey: string }) => call('org_consent_decide_v1', { p_contract_id: input.contractId, p_action: input.action, p_items: input.items, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<ConsultancyConsentResult>,
      /** Encerra e revoga o acesso imediatamente; a recorrência externa é cancelada de forma idempotente. (command; contract/org/contract_end.v1.json) */
      contractEnd: (input: { contractId: string; reason: "member_request" | "out_of_scope" | "no_client_response" | "inappropriate_conduct" | "unavailable" | "other"; note?: string; expectedVersion: number; idempotencyKey: string }) => invoke('worker', '/org/contract-end', { contract_id: input.contractId, reason: input.reason, note: input.note, expected_version: input.expectedVersion, idempotency_key: input.idempotencyKey }) as Promise<ConsultancyContractEndResult>,
      /** Lista as consultorias da própria conta, com oferta, profissional e decisões de acesso tipadas. (query; contract/org/contracts.v1.json) */
      contracts: () => call('org_contracts_v1', {}) as Promise<OwnConsultancyContract[]>,
      /** Solicita item adicional para uma consultoria vigente do negócio. (command; contract/org/crm_access_request.v1.json) */
      crmAccessRequest: (input: { clientId: string; businessId: string; contractId: string; items: ("training" | "diet" | "protocols" | "health")[]; reason: string; expectedVersion: number; idempotencyKey: string }) => call('org_crm_access_request_v1', { p_client_id: input.clientId, p_business_id: input.businessId, p_contract_id: input.contractId, p_items: input.items, p_reason: input.reason, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<OrgCrmWorkspace>,
      /** Lista única e paginada dos clientes de todos os negócios autorizados. (query; contract/org/crm_clients.v1.json) */
      crmClients: (input: { businessId?: string; view?: "all" | "customers" | "leads" | "pending_first_contact" | "archived"; search?: string; subscription?: "all" | "active" | "none"; purchase?: "all" | "recent" | "none"; sort?: "recent" | "name"; cursor?: string; limit?: number } = {}) => call('org_crm_clients_v1', { p_business_id: input.businessId, p_view: input.view, p_search: input.search, p_subscription: input.subscription, p_purchase: input.purchase, p_sort: input.sort, p_cursor: input.cursor, p_limit: input.limit }) as Promise<OrgCrmClientsResult>,
      /** Resume o CRM sem duplicar clientes presentes em mais de um negócio autorizado. (query; contract/org/crm_overview.v1.json) */
      crmOverview: () => call('org_crm_overview_v1', {}) as Promise<OrgCrmOverview>,
      /** Prepara a contratação de uma consultoria com partes, escopo e documentos vigentes validados no servidor. (query; contract/org/hire_prepare.v1.json) */
      hirePrepare: (input: { offerId: string }) => call('org_hire_prepare_v1', { p_offer_id: input.offerId }) as Promise<ConsultancyHirePreparation>,
      /** Lista pedidos e concessões avulsas do titular. (query; contract/org/my_access.v1.json) */
      myAccess: () => call('org_my_access_v1', {}) as Promise<OrgMyAccess>,
      /** Decide ou revoga acesso avulso com concorrência otimista. (command; contract/org/my_access_act.v1.json) */
      myAccessAct: (input: { accessId: string; action: "allow" | "deny" | "revoke"; expectedVersion: number; idempotencyKey: string }) => call('org_my_access_act_v1', { p_access_id: input.accessId, p_action: input.action, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<OrgMyAccess>,
      /** Convida, aceita, recusa, muda o nível de acesso ou remove uma pessoa da equipe. (command; contract/org/team_act.v1.json) */
      teamAct: (input: { businessId: string; action: "invite" | "accept" | "decline" | "setAccess" | "remove"; input?: TeamActionInput }) => call('org_team_act_v1', { p_business_id: input.businessId, p_action: input.action, p_input: input.input }) as Promise<TeamActionResult>,
    },
    social: {
      /** Abre um desafio e sua participação atual. (query; contract/social/challenge.v1.json) */
      challenge: (input: { id: string }) => call('social_challenge_v1', { p_id: input.id }) as Promise<SocialGroup>,
      /** Executa uma ação discriminada e versionada no desafio. (command; contract/social/challenge_act.v1.json) */
      challengeAct: (input: { command: SocialChallengeActionCommand }) => call('social_challenge_act_v1', { p_command: input.command }) as Promise<SocialGroup>,
      /** Ranking do desafio pela métrica declarada, com desempate e a posição de quem vê. (query; contract/social/challenge_ranking.v1.json) */
      challengeRanking: (input: { id: string; cursor?: number; limit?: number }) => call('social_challenge_ranking_v1', { p_id: input.id, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialChallengeRanking>,
      /** Cria ou atualiza desafio com concorrência otimista e replay exato. (command; contract/social/challenge_save.v1.json) */
      challengeSave: (input: { challenge: SocialChallengeSaveCommand }) => call('social_challenge_save_v1', { p_challenge: input.challenge }) as Promise<SocialGroup>,
      /** Lista desafios por descoberta, participação ou histórico. (query; contract/social/challenges.v1.json) */
      challenges: (input: { tab?: "discover" | "mine" | "history"; search?: string; cursor?: string; limit?: number } = {}) => call('social_challenges_v1', { p_tab: input.tab, p_search: input.search, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialChallenges>,
      /** Lista comunidades por descoberta, participação ou histórico. (query; contract/social/communities.v1.json) */
      communities: (input: { tab?: "discover" | "mine" | "history"; search?: string; cursor?: string; limit?: number } = {}) => call('social_communities_v1', { p_tab: input.tab, p_search: input.search, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialCommunities>,
      /** Abre uma comunidade com sua política efetiva de acesso. (query; contract/social/community.v1.json) */
      community: (input: { id: string }) => call('social_community_v1', { p_id: input.id }) as Promise<SocialGroup>,
      /** Executa uma ação discriminada e versionada na comunidade. (command; contract/social/community_act.v1.json) */
      communityAct: (input: { command: SocialCommunityActionCommand }) => call('social_community_act_v1', { p_command: input.command }) as Promise<SocialGroup>,
      /** Eventos da comunidade em ordem de data: próximos ou passados. (query; contract/social/community_agenda.v1.json) */
      communityAgenda: (input: { id: string; scope?: "upcoming" | "past"; cursor?: string; limit?: number }) => call('social_community_agenda_v1', { p_id: input.id, p_scope: input.scope, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialCommunityAgenda>,
      /** Acervo da comunidade: materiais publicados pela equipe. (query; contract/social/community_library.v1.json) */
      communityLibrary: (input: { id: string; cursor?: string; limit?: number }) => call('social_community_library_v1', { p_id: input.id, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialCommunityLibrary>,
      /** Membros mais ativos do mês na comunidade, com a posição de quem vê. (query; contract/social/community_ranking.v1.json) */
      communityRanking: (input: { id: string; cursor?: number; limit?: number }) => call('social_community_ranking_v1', { p_id: input.id, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialCommunityRanking>,
      /** Cria ou atualiza comunidade com concorrência otimista e replay exato. (command; contract/social/community_save.v1.json) */
      communitySave: (input: { community: SocialCommunitySaveCommand }) => call('social_community_save_v1', { p_community: input.community }) as Promise<SocialGroup>,
      /** Mensagens privadas paginadas com uma pessoa. (query; contract/social/conversation.v1.json) */
      conversation: (input: { peerId: string; cursor?: string; limit?: number }) => call('social_conversation_v1', { p_peer_id: input.peerId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialConversation>,
      /** Inspeciona a capa em quarentena e a publica no bucket de miniaturas; a escolha (quadro ou galeria) fica imutável. (command; contract/social/cover_prepare.v1.json) */
      coverPrepare: (input: { uploadId: string; source: "frame" | "gallery"; frameTimeSeconds?: number }) => invoke('worker', '/media/cover-prepare', { upload_id: input.uploadId, source: input.source, frame_time_seconds: input.frameTimeSeconds }) as Promise<CoverPrepared>,
      /** Abre a quarentena de uma capa JPEG escolhida pelo autor. (command; contract/social/cover_upload.v1.json) */
      coverUpload: (input: { contentLength: number }) => invoke('worker', '/media/cover-upload', { content_length: input.contentLength }) as Promise<CoverUpload>,
      /** Lê em lote somente as credenciais profissionais aprovadas dos perfis públicos. (query; contract/social/credentials.v1.json) */
      credentials: (input: { accountIds: string[] }) => call('social_credentials_v1', { p_account_ids: input.accountIds }) as Promise<ProfessionalCredential[]>,
      /** Descobre apenas profissionais, embaixadores e associados. Publicações mais recentes primeiro; em empate, embaixador, associado, profissional e UUID decrescente. (query; contract/social/explore.v1.json) */
      explore: (input: { search?: string; affinity?: string; classifications?: ("professional" | "associate" | "ambassador")[]; cursor?: string; limit?: number } = {}) => call('social_explore_v1', { p_search: input.search, p_affinity: input.affinity, p_classifications: input.classifications, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialExplore>,
      /** Feed configurado no backoffice: novidades de 24h e 7d por grupos com preferência por seguidos; histórico cronológico ou proporção entre seguidos e descoberta. (query; contract/social/feed.v1.json) */
      feed: (input: { affinities?: string[]; cursor?: string; limit?: number; containerType?: "community" | "challenge"; containerId?: string; spaceId?: string } = {}) => call('social_feed_v1', { p_affinities: input.affinities, p_cursor: input.cursor, p_limit: input.limit, p_container_type: input.containerType, p_container_id: input.containerId, p_space_id: input.spaceId }) as Promise<SocialFeed>,
      /** Segue, deixa de seguir, bloqueia ou desbloqueia e devolve o estado final. (command; contract/social/follow_act.v1.json) */
      followAct: (input: { accountId: string; action: "follow" | "unfollow" | "block" | "unblock" }) => call('social_follow_act_v1', { p_account_id: input.accountId, p_action: input.action }) as Promise<SocialRelationState>,
      /** Central paginada de conversas, busca privada ou notificações. (query; contract/social/inbox.v1.json) */
      inbox: (input: { tab?: "messages" | "notifications"; cursor?: string; limit?: number; search?: string } = {}) => call('social_inbox_v1', { p_tab: input.tab, p_cursor: input.cursor, p_limit: input.limit, p_search: input.search }) as Promise<SocialInbox>,
      /** Envia, compartilha, lê ou exclui mensagem privada de modo idempotente. (command; contract/social/message_act.v1.json) */
      messageAct: (input: { recipientIds: string[]; action: "send" | "share" | "markRead" | "delete"; data?: SocialMessageActionData }) => call('social_message_act_v1', { p_recipient_ids: input.recipientIds, p_action: input.action, p_data: input.data }) as Promise<SocialMessageActionResult>,
      /** Emite URL privada curta após validar a mensagem, participantes, bloqueios e integridade do anexo. (query; contract/social/message_media_access.v1.json) */
      messageMediaAccess: (input: { download?: boolean; messageId: string }) => invoke('worker', '/social/message-media-access', { download: input.download, message_id: input.messageId }) as Promise<SocialMessageMediaAccess>,
      /** Prepara e confirma anexos privados de mensagem com inspeção, dono e idempotência no Core. (command; contract/social/message_media_upload.v1.json) */
      messageMediaUpload: (input: { upload: SocialMessageMediaUploadInput }) => invoke('worker', '/social/message-media-upload', { upload: input.upload }) as Promise<SocialMessageMediaUpload>,
      /** Marca visualização ou leitura sem misturar as duas semânticas. (command; contract/social/notification_act.v1.json) */
      notificationAct: (input: { ids?: string[]; action?: "markRead" | "markAllRead" | "clearBadge" } = {}) => call('social_notification_act_v1', { p_ids: input.ids, p_action: input.action }) as Promise<SocialInbox>,
      /** Lista pessoas com paginação determinística. discover e explore só retornam contas ativas com acesso liberado pela Plataforma, antes da busca, total e paginação; discover inclui usuários comuns, explore restringe a profissionais e rede pública. Relações históricas não mudam. (query; contract/social/people.v1.json) */
      people: (input: { scope?: "discover" | "explore" | "followers" | "following" | "subscribers" | "ambassadors"; accountId?: string; search?: string; affinity?: string; classifications?: ("professional" | "associate" | "ambassador")[]; cursor?: string; limit?: number } = {}) => call('social_people_v1', { p_scope: input.scope, p_account_id: input.accountId, p_search: input.search, p_affinity: input.affinity, p_classifications: input.classifications, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialPeople>,
      /** Abre publicação visível com interação atual. (query; contract/social/post.v1.json) */
      post: (input: { id: string }) => call('social_post_v1', { p_id: input.id }) as Promise<SocialPost>,
      /** Executa uma alteração discriminada, versionada e idempotente em publicação própria. (command; contract/social/post_act.v1.json) */
      postAct: (input: { command: SocialPostActionCommand }) => call('social_post_act_v1', { p_command: input.command }) as Promise<SocialPost>,
      /** Salva, remove dos salvos ou registra visualização de uma publicação de forma idempotente. (command; contract/social/post_event_act.v1.json) */
      postEventAct: (input: { id: string; action: "save" | "unsave" | "view" }) => call('social_post_event_act_v1', { p_id: input.id, p_action: input.action }) as Promise<SocialPost>,
      /** Localiza uma publicação ou story próprio pela chave idempotente antes de repetir uploads. (query; contract/social/post_lookup.v1.json) */
      postLookup: (input: { idempotencyKey: string; kind?: "post" | "story" }) => call('social_post_lookup_v1', { p_idempotency_key: input.idempotencyKey, p_kind: input.kind }) as Promise<SocialPostLookup>,
      /** Cria ou edita publicação com comando discriminado, replay exato e concorrência otimista na edição. (command; contract/social/post_save.v1.json) */
      postSave: (input: { post: SocialPostSaveCommand }) => call('social_post_save_v1', { p_post: input.post }) as Promise<SocialPost>,
      /** Lê um conjunto ordenado de publicações visíveis sem acesso direto às tabelas. (query; contract/social/posts.v1.json) */
      posts: (input: { ids: string[] }) => call('social_posts_v1', { p_ids: input.ids }) as Promise<SocialPosts>,
      /** Entrega a vitrine pública tipada de um profissional sem expor as tabelas de comércio e grupos. (query; contract/social/professional_showcase.v1.json) */
      professionalShowcase: (input: { professionalId: string }) => call('social_professional_showcase_v1', { p_professional_id: input.professionalId }) as Promise<ProfessionalShowcase>,
      /** Salva a ordem das categorias e a oferta destacada da própria vitrine profissional. (command; contract/social/professional_showcase_save.v1.json) */
      professionalShowcaseSave: (input: { categoryOrder: string[]; featuredOfferingId?: string | null }) => call('social_professional_showcase_save_v1', { p_category_order: input.categoryOrder, p_featured_offering_id: input.featuredOfferingId }) as Promise<ProfessionalShowcaseConfig>,
      /** Perfil público, publicações e stories ativos. (query; contract/social/profile.v1.json) */
      profile: (input: { username: string; cursor?: string; limit?: number; scope?: "all" | "free" | "paid" | "owned" }) => call('social_profile_v1', { p_username: input.username, p_cursor: input.cursor, p_limit: input.limit, p_scope: input.scope }) as Promise<SocialProfile>,
      /** Executa uma ação moderável sobre um perfil público. (command; contract/social/profile_act.v1.json) */
      profileAct: (input: { accountId: string; action: "report"; data?: SocialProfileActionData }) => call('social_profile_act_v1', { p_account_id: input.accountId, p_action: input.action, p_data: input.data }) as Promise<SocialProfileActionResult>,
      /** Resolve um perfil por usuário e devolve o estado de bloqueio sem expor conteúdo bloqueado. (query; contract/social/profile_relation.v1.json) */
      profileRelation: (input: { username: string }) => call('social_profile_relation_v1', { p_username: input.username }) as Promise<SocialProfileRelation>,
      /** Denuncia conteúdo, mensagem, perfil, oferta ou grupo visível sem acesso direto às tabelas. (command; contract/social/report.v1.json) */
      report: (input: { targetType: "post" | "post_comment" | "direct_message" | "challenge" | "challenge_run" | "product" | "user" | "community_post" | "story" | "story_comment"; targetId: string; reason: "nudity_sexual" | "violence" | "hate_harassment" | "dangerous_challenge" | "self_harm_eating_disorder" | "spam_scam" | "other"; description?: string | null }) => call('social_report_v1', { p_target_type: input.targetType, p_target_id: input.targetId, p_reason: input.reason, p_description: input.description }) as Promise<SocialReportResult>,
      /** URL curta para ler ou baixar um material da comunidade; o acesso é revalidado a cada pedido. (query; contract/social/resource_access.v1.json) */
      resourceAccess: (input: { postId: string; download?: boolean }) => invoke('worker', '/social/resource-access', { post_id: input.postId, download: input.download }) as Promise<SocialResourceAccess>,
      /** Prepara e confirma o upload privado de um material da comunidade. (command; contract/social/resource_upload.v1.json) */
      resourceUpload: (input: { upload: SocialResourceUploadInput }) => invoke('worker', '/social/resource-upload', { upload: input.upload }) as Promise<SocialResourceUpload>,
      /** Stories ativos e visíveis em ordem de exibição. (query; contract/social/stories.v1.json) */
      stories: (input: { authorId?: string; cursor?: string; limit?: number } = {}) => call('social_stories_v1', { p_author_id: input.authorId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<SocialStories>,
      /** Registra visualizações ou altera um story de modo idempotente. (command; contract/social/story_act.v1.json) */
      storyAct: (input: { ids: string[]; action: "view" | "setCommentsEnabled" | "convertToPost" | "delete"; data?: SocialStoryActionData }) => call('social_story_act_v1', { p_ids: input.ids, p_action: input.action, p_data: input.data }) as Promise<SocialStoryActionResult>,
      /** Emite uma capacidade opaca de 60 segundos para ler mídia privada de um story que a conta pode ver agora. (query; contract/social/story_media_access.v1.json) */
      storyMediaAccess: (input: { objectKey: string }) => invoke('worker', '/media/story-access', { object_key: input.objectKey }) as Promise<StoryMediaAccess>,
      /** Publica ou edita um story de mídia única que expira em 24 horas. (command; contract/social/story_save.v1.json) */
      storySave: (input: { story: SocialStoryInput }) => call('social_story_save_v1', { p_story: input.story }) as Promise<SocialPost>,
      /** Lê os limites efetivos de publicação do Estúdio para a conta autenticada. Principais e associados ativos recebem o mesmo limite. (query; contract/social/studio.v1.json) */
      studio: () => call('social_studio_v1', {}) as Promise<SocialPublicationPolicy>,
      /** URL assinada para enviar mídia ao R2; stories retornam objectKey privado e nunca uma URL pública permanente. (command; contract/social/upload.v1.json) */
      upload: (input: { filename: string; contentType: string; targetBucket?: "onlyfit-media" | "onlyfit-thumbnails" | "onlyfit-avatar" | "onlyfit-stories" | "onlyfit-private"; contentLength: number; requestId?: string; tenantId?: string; docKind?: string }) => invoke('worker', '/media/upload-url', { filename: input.filename, content_type: input.contentType, target_bucket: input.targetBucket, content_length: input.contentLength, request_id: input.requestId, tenant_id: input.tenantId, doc_kind: input.docKind }) as Promise<MediaUpload>,
      /** Confirma no R2 tamanho e MIME do upload direto antes de liberar o arquivo para publicação. (command; contract/social/upload_complete.v1.json) */
      uploadComplete: (input: { fileId: string }) => invoke('worker', '/media/upload-complete', { file_id: input.fileId }) as Promise<MediaUploadCompleted>,
      /** Relata uma falha de envio de mídia sem URL nem dado pessoal (telemetria). (command; contract/social/upload_failure.v1.json) */
      uploadFailure: (input: { uploadId?: string; stage: string; providerCode?: string; httpStatus?: number }) => invoke('worker', '/media/upload-failure', { upload_id: input.uploadId, stage: input.stage, provider_code: input.providerCode, http_status: input.httpStatus }) as Promise<UploadFailureRecorded>,
      /** Inspeciona o vídeo em quarentena e o promove ao destino social registrado. Repetir devolve o mesmo resultado. (command; contract/social/video_finalize.v1.json) */
      videoFinalize: (input: { uploadId: string }) => invoke('worker', '/media/video-finalize', { upload_id: input.uploadId }) as Promise<VideoFinalized>,
      /** Abre a quarentena de um vídeo social e registra seu destino canônico antes do envio. (command; contract/social/video_upload.v1.json) */
      videoUpload: (input: { filename: string; contentType: "video/mp4" | "video/webm" | "video/quicktime" | "video/x-m4v" | "video/ogg"; contentLength: number; audioMode: "preserve" | "remove" | "absent"; destination: "post" | "story" }) => invoke('worker', '/media/video-upload', { filename: input.filename, content_type: input.contentType, content_length: input.contentLength, audio_mode: input.audioMode, destination: input.destination }) as Promise<VideoUpload>,
      /** Retoma, assina partes, conclui ou cancela o envio da sessão privada de vídeo. (command; contract/social/video_upload_act.v1.json) */
      videoUploadAct: (input: { uploadId: string; action: "status" | "signPart" | "complete" | "cancel"; partNumber?: number }) => invoke('worker', '/media/video-upload-act', { upload_id: input.uploadId, action: input.action, part_number: input.partNumber }) as Promise<VideoUploadState>,
    },
    interaction: {
      /** Executa reação, comentário, edição, remoção ou denúncia discriminada e idempotente. (command; contract/social/interaction_act.v1.json) */
      act: (input: { command: SocialInteractionCommand }) => call('interaction_act_v1', { p_command: input.command }) as Promise<SocialPost>,
      /** Lista paginada de perfis que curtiram, confirmaram Vou ou estiveram presentes. (query; contract/social/interaction_likers.v1.json) */
      likers: (input: { targetId: string; cursor?: number; limit?: number; kind?: "like" | "rsvp" | "attended" }) => call('interaction_likers_v1', { p_target_id: input.targetId, p_cursor: input.cursor, p_limit: input.limit, p_kind: input.kind }) as Promise<InteractionLikers>,
      /** Thread única e paginada para comentários de qualquer conteúdo. (query; contract/social/interaction_thread.v1.json) */
      thread: (input: { targetId: string; cursor?: string; limit?: number }) => call('interaction_thread_v1', { p_target_id: input.targetId, p_cursor: input.cursor, p_limit: input.limit }) as Promise<InteractionThread>,
    },
    staff: {
      /** Lê uma conta e seus vínculos operacionais canônicos, sem credenciais. (query; contract/staff/account.v1.json) */
      account: (input: { id: string }) => call('staff_account_v1', { p_id: input.id }) as Promise<StaffAccount>,
      /** Define ou remove um papel interno com segregação administrativa. (command; contract/staff/account_act.v1.json) */
      accountAct: (input: { id: string; command: StaffAccountCommand }) => call('staff_account_act_v1', { p_id: input.id, p_command: input.command }) as Promise<StaffAccount>,
      /** Busca contas canônicas por cursor e filtro operacional. (query; contract/staff/accounts.v1.json) */
      accounts: (input: { search?: string; filter?: "all" | "staff" | "professional" | "inactive"; createdFrom?: string; createdTo?: string; cursor?: string; limit?: number } = {}) => call('staff_accounts_v1', { p_search: input.search, p_filter: input.filter, p_created_from: input.createdFrom, p_created_to: input.createdTo, p_cursor: input.cursor, p_limit: input.limit }) as Promise<StaffAccounts>,
      /** Lê a rede comercial administrativa, suas regiões, políticas, solicitações e auditoria. (query; contract/staff/ambassador_network.v1.json) */
      ambassadorNetwork: (input: { search?: string; affinityGroupKey?: string; regionId?: string | null; status?: "draft" | "pending" | "active" | "suspended" | "ended"; cursor?: string; limit?: number } = {}) => call('staff_ambassador_network_v1', { p_search: input.search, p_affinity_group_key: input.affinityGroupKey, p_region_id: input.regionId, p_status: input.status, p_cursor: input.cursor, p_limit: input.limit }) as Promise<StaffAmbassadorNetwork>,
      /** Administra regiões, políticas, atribuições e solicitações da rede com concorrência otimista. (command; contract/staff/ambassador_network_act.v1.json) */
      ambassadorNetworkAct: (input: { id?: string | null; action: "saveRegion" | "setRegionActive" | "savePolicy" | "setProgram" | "saveAssignment" | "transitionAssignment" | "transferAssociate" | "decideRequest" | "transferRequest"; data?: StaffAmbassadorNetworkActionData }) => call('staff_ambassador_network_act_v1', { p_id: input.id, p_action: input.action, p_data: input.data }) as Promise<StaffAmbassadorNetworkActionResult>,
      /** Lista o estado operacional de produtos do App Store Connect. (query; contract/staff/app_store_catalog.v1.json) */
      appStoreCatalog: (input: { limit?: number; offset?: number } = {}) => call('staff_app_store_catalog_v1', { p_limit: input.limit, p_offset: input.offset }) as Promise<StaffAppStoreCatalogPage>,
      /** Prepara, sincroniza, publica ou salva o catálogo Apple tradicional por oferta. Produtos genéricos Advanced Commerce não são editáveis por este fluxo. (command; contract/staff/app_store_catalog_act.v1.json) */
      appStoreCatalogAct: (input: { offerId: string; action: "prepare" | "sync" | "publish" | "saveMetadata"; metadata: StaffAppStoreMetadataInput | null; expectedVersion: number; idempotencyKey: string }) => call('staff_app_store_catalog_act_v1', { p_offer_id: input.offerId, p_action: input.action, p_metadata: input.metadata, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffAppStoreCatalogItem>,
      /** Lista lotes mensais de conciliação Apple. (query; contract/staff/app_store_reconciliation_batches.v1.json) */
      appStoreReconciliationBatches: (input: { limit?: number; offset?: number } = {}) => call('staff_app_store_reconciliation_batches_v1', { p_limit: input.limit, p_offset: input.offset }) as Promise<StaffAppStoreReconciliationBatchPage>,
      /** Lista linhas de um lote de conciliação Apple. (query; contract/staff/app_store_reconciliation_lines.v1.json) */
      appStoreReconciliationLines: (input: { batchId: string; limit?: number; offset?: number }) => call('staff_app_store_reconciliation_lines_v1', { p_batch_id: input.batchId, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffAppStoreReconciliationLinePage>,
      /** Importa e concilia um mês fiscal Apple no worker. (command; contract/staff/app_store_reconciliation_start.v1.json) */
      appStoreReconciliationStart: (input: { month: string; idempotencyKey: string }) => invoke('worker', '/staff/app-store-reconciliation-start', { month: input.month, idempotency_key: input.idempotencyKey }) as Promise<StaffAppStoreReconciliationBatch>,
      /** Prepara e conclui upload privado e inspecionado de imagem de revisão Apple. (command; contract/staff/app_store_review_upload.v1.json) */
      appStoreReviewUpload: (input: { upload: StaffAppStoreReviewUploadCommand }) => invoke('worker', '/staff/app-store-review-upload', { upload: input.upload }) as Promise<StaffAppStoreReviewUploadResult>,
      /** Lista compras Apple sem inferir taxas ou liquidação ausentes. (query; contract/staff/app_store_transactions.v1.json) */
      appStoreTransactions: (input: { environment: "Production" | "Sandbox"; search?: string | null; status?: "active" | "expired" | "revoked" | null; limit?: number; offset?: number }) => call('staff_app_store_transactions_v1', { p_environment: input.environment, p_search: input.search, p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffAppStoreTransactionPage>,
      /** Auditoria append-only filtrada. (query; contract/staff/audit.v1.json) */
      audit: (input: { actorId?: string; targetType?: string; targetId?: string; from?: string; to?: string; cursor?: number; limit?: number } = {}) => call('staff_audit_v1', { p_actor_id: input.actorId, p_target_type: input.targetType, p_target_id: input.targetId, p_from: input.from, p_to: input.to, p_cursor: input.cursor, p_limit: input.limit }) as Promise<StaffAudit>,
      /** Lista e resume relatos históricos do beta para triagem staff. (query; contract/staff/beta_feedback.v1.json) */
      betaFeedback: (input: { status?: "new" | "in_review" | "resolved" | "discarded"; limit?: number; offset?: number } = {}) => call('staff_beta_feedback_v1', { p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffBetaFeedbackPage>,
      /** Emite URL curta para a captura privada associada ao relato. (command; contract/staff/beta_feedback_screenshot.v1.json) */
      betaFeedbackScreenshot: (input: { feedbackId: string }) => invoke('worker', '/staff/beta-feedback-screenshot', { feedback_id: input.feedbackId }) as Promise<StaffBetaFeedbackScreenshot>,
      /** Atualiza a triagem de um relato com concorrência otimista e replay exato. (command; contract/staff/beta_feedback_update.v1.json) */
      betaFeedbackUpdate: (input: { id: string; status: "new" | "in_review" | "resolved" | "discarded"; internalNotes: string; expectedVersion: number; idempotencyKey: string }) => call('staff_beta_feedback_update_v1', { p_id: input.id, p_status: input.status, p_internal_notes: input.internalNotes, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffBetaFeedbackItem>,
      /** Aprova ou rejeita uma empresa submetida à verificação. (command; contract/staff/business_verification_act.v1.json) */
      businessVerificationAct: (input: { businessId: string; action: "approve" | "reject"; reason?: string | null }) => call('staff_business_verification_act_v1', { p_business_id: input.businessId, p_action: input.action, p_reason: input.reason }) as Promise<StaffBusinessVerificationDecision>,
      /** Lista empresas submetidas à verificação da plataforma. (query; contract/staff/business_verifications.v1.json) */
      businessVerifications: (input: { status?: "pending_review" | "approved" | "rejected"; limit?: number; offset?: number } = {}) => call('staff_business_verifications_v1', { p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffBusinessVerifications>,
      /** Lê um catálogo operacional permitido, incluindo inativos e impacto. (query; contract/staff/catalog.v1.json) */
      catalog: (input: { kind: "affinity_groups" | "sports" | "session_types" | "fight_techniques" | "protocol_templates" | "business_niches" | "professional_specialties" | "product_categories" | "food_sources" | "nutrients" | "offer_types" | "payment_providers" }) => call('staff_catalog_v1', { p_kind: input.kind }) as Promise<StaffCatalog>,
      /** Ativa um item de catálogo depois de revalidar a configuração. (command; contract/staff/catalog_activate.v1.json) */
      catalogActivate: (input: { kind: "affinity_groups" | "sports" | "session_types" | "fight_techniques" | "protocol_templates" | "business_niches" | "professional_specialties" | "product_categories" | "food_sources" | "nutrients" | "offer_types"; key: string; expectedVersion: number }) => call('staff_catalog_activate_v1', { p_kind: input.kind, p_key: input.key, p_expected_version: input.expectedVersion }) as Promise<StaffCatalogItem>,
      /** Desativa um item de catálogo após confirmação literal, preservando referências históricas. (command; contract/staff/catalog_deactivate.v1.json) */
      catalogDeactivate: (input: { kind: "affinity_groups" | "sports" | "session_types" | "fight_techniques" | "protocol_templates" | "business_niches" | "professional_specialties" | "product_categories" | "food_sources" | "nutrients" | "offer_types"; key: string; expectedVersion: number; confirmation: string }) => call('staff_catalog_deactivate_v1', { p_kind: input.kind, p_key: input.key, p_expected_version: input.expectedVersion, p_confirmation: input.confirmation }) as Promise<StaffCatalogItem>,
      /** Reordena integralmente um catálogo em uma única transação auditada. (command; contract/staff/catalog_reorder.v1.json) */
      catalogReorder: (input: { kind: "affinity_groups" | "sports" | "session_types" | "fight_techniques" | "protocol_templates" | "business_niches" | "professional_specialties" | "product_categories" | "food_sources" | "nutrients" | "offer_types"; keys: string[] }) => call('staff_catalog_reorder_v1', { p_kind: input.kind, p_keys: input.keys }) as Promise<StaffCatalogReordered>,
      /** Salva item inteiro de um catálogo permitido, com concorrência otimista e validação específica. (command; contract/staff/catalog_save.v1.json) */
      catalogSave: (input: { item: StaffCatalogSaveItem }) => call('staff_catalog_save_v1', { p_item: input.item }) as Promise<StaffCatalogItem>,
      /** Decide uma contestação; o resultado congela quando não restar contestação aberta. (command; contract/staff/challenge_dispute_act.v1.json) */
      challengeDisputeAct: (input: { id: string; action: "uphold" | "dismiss"; note: string }) => call('staff_challenge_dispute_act_v1', { p_id: input.id, p_action: input.action, p_note: input.note }) as Promise<StaffChallengeDispute>,
      /** Contestações de resultado de desafio para análise da staff. (query; contract/staff/challenge_disputes.v1.json) */
      challengeDisputes: (input: { status?: "open" | "resolved"; limit?: number; offset?: number } = {}) => call('staff_challenge_disputes_v1', { p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffChallengeDisputes>,
      /** Lista custos por canal como políticas normais, inclusive Apple. (query; contract/staff/channel_cost_policies.v1.json) */
      channelCostPolicies: (input: { status?: string | null; limit?: number; offset?: number } = {}) => call('staff_channel_cost_policies_v1', { p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffChannelCostPolicyPage>,
      /** Cria e governa versões imutáveis de custo por canal. (command; contract/staff/channel_cost_policy_act.v1.json) */
      channelCostPolicyAct: (input: { action: "create" | "publish" | "activate" | "retire"; policyId: string | null; data: StaffChannelCostPolicyCommandData; expectedVersion: number | null; idempotencyKey: string }) => call('staff_channel_cost_policy_act_v1', { p_action: input.action, p_policy_id: input.policyId, p_data: input.data, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffChannelCostPolicy>,
      /** Lista comunidades para operação e moderação da plataforma. (query; contract/staff/communities.v1.json) */
      communities: (input: { status?: "draft" | "published" | "entry_paused" | "read_only" | "suspended" | "archived"; query?: string; limit?: number; offset?: number } = {}) => call('staff_communities_v1', { p_status: input.status, p_query: input.query, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffCommunities>,
      /** Suspende, restaura, limita a leitura ou arquiva uma comunidade. (command; contract/staff/community_act.v1.json) */
      communityAct: (input: { communityId: string; action: "suspend" | "restore" | "read_only" | "archive"; reason?: string | null }) => call('staff_community_act_v1', { p_community_id: input.communityId, p_action: input.action, p_reason: input.reason }) as Promise<StaffCommunityDecision>,
      /** Cria e governa versões imutáveis de matrizes de compensação. (command; contract/staff/compensation_matrix_act.v1.json) */
      compensationMatrixAct: (input: { action: "create" | "saveScenario" | "publish" | "activate" | "retire"; matrixId: string | null; data: StaffCompensationMatrixCommandData; expectedVersion: number | null; idempotencyKey: string }) => call('staff_compensation_matrix_act_v1', { p_action: input.action, p_matrix_id: input.matrixId, p_data: input.data, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffCompensationMatrix>,
      /** Lista versões de matrizes de compensação. (query; contract/staff/compensation_policies.v1.json) */
      compensationPolicies: (input: { status?: string | null; limit?: number; offset?: number } = {}) => call('staff_compensation_policies_v1', { p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffCompensationMatrixPage>,
      /** Simula distribuição e custo de canal com as políticas ativas. (query; contract/staff/compensation_simulate.v1.json) */
      compensationSimulate: (input: { amount: number; currency: string; offeringType: string; scenario: "direct_to_principal" | "via_associate" | "no_principal" | "via_associate_without_principal"; provider: "apple" | "google" | "stripe" | "asaas"; paymentMethod: "app_store" | "google_play" | "card" | "pix"; affinityGroup?: string | null; regionCode?: string | null; at?: string | null }) => call('staff_compensation_simulate_v1', { p_amount: input.amount, p_currency: input.currency, p_offering_type: input.offeringType, p_scenario: input.scenario, p_provider: input.provider, p_payment_method: input.paymentMethod, p_affinity_group: input.affinityGroup, p_region_code: input.regionCode, p_at: input.at }) as Promise<StaffCompensationSimulation>,
      /** Modera uma denúncia de comentário com concorrência otimista. (command; contract/staff/course_comment_report_act.v1.json) */
      courseCommentReportAct: (input: { reportId: string; action: "dismiss" | "remove"; reason: string; expectedVersion: number; idempotencyKey: string }) => call('staff_course_comment_report_act_v1', { p_report_id: input.reportId, p_action: input.action, p_reason: input.reason, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffCourseCommentReportActionResult>,
      /** Lista denúncias de comentários da área de membros. (query; contract/staff/course_comment_reports.v1.json) */
      courseCommentReports: (input: { status?: string | null; limit?: number; offset?: number } = {}) => call('staff_course_comment_reports_v1', { p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffCourseCommentReportPage>,
      /** Redefine senha ou MFA de outra conta sem expor segredo ou link ao backoffice. (command; contract/staff/credential_reset.v1.json) */
      credentialReset: (input: { targetId: string; action: "password" | "mfa"; reason?: string }) => invoke('worker', '/staff/credential-reset', { target_id: input.targetId, action: input.action, reason: input.reason }) as Promise<StaffCredentialResetResult>,
      /** Snapshot administrativo canônico, com indicadores operacionais e financeiros derivados do Core. (query; contract/staff/dashboard.v1.json) */
      dashboard: (input: { section?: "overview" | "acquisition" | "activation" | "engagement" | "retention" | "network" | "business" | "accounts"; from?: string; to?: string } = {}) => call('staff_dashboard_v1', { p_section: input.section, p_from: input.from, p_to: input.to }) as Promise<StaffDashboard>,
      /** Emite URL curta e autenticada para um anexo privado do Email Center. (command; contract/staff/email_attachment.v1.json) */
      emailAttachment: (input: { attachmentId: string }) => invoke('worker', '/staff/email-attachment', { attachment_id: input.attachmentId }) as Promise<StaffEmailAttachmentDownload>,
      /** Lista caixas canônicas do Email Center e suas contagens não lidas. (query; contract/staff/email_mailboxes.v1.json) */
      emailMailboxes: () => call('staff_email_mailboxes_v1', {}) as Promise<StaffEmailMailbox[]>,
      /** Envia uma nova mensagem ou resposta administrativa pelo provedor canônico. (command; contract/staff/email_send.v1.json) */
      emailSend: (input: { from: string; senderName: string; to: string[]; cc: string[]; bcc: string[]; subject: string; html: string; idempotencyKey: string; attachments?: StaffEmailOutboundAttachment[]; threadId?: string; replyToMessageId?: string }) => invoke('worker', '/staff/email-send', { from: input.from, sender_name: input.senderName, to: input.to, cc: input.cc, bcc: input.bcc, subject: input.subject, html: input.html, idempotency_key: input.idempotencyKey, attachments: input.attachments, thread_id: input.threadId, reply_to_message_id: input.replyToMessageId }) as Promise<StaffEmailSendResult>,
      /** Reconcilia caixas autorizadas com o provedor sem expor credenciais ao cliente. (command; contract/staff/email_sync.v1.json) */
      emailSync: (input: { idempotencyKey: string }) => invoke('worker', '/staff/email-sync', { idempotency_key: input.idempotencyKey }) as Promise<StaffEmailSyncResult>,
      /** Obtém uma conversa e suas mensagens relacionais. (query; contract/staff/email_thread.v1.json) */
      emailThread: (input: { threadId: string }) => call('staff_email_thread_v1', { p_thread_id: input.threadId }) as Promise<StaffEmailThread>,
      /** Marca uma conversa como lida de forma idempotente para a pessoa staff atual. (command; contract/staff/email_thread_read.v1.json) */
      emailThreadRead: (input: { threadId: string; idempotencyKey: string }) => call('staff_email_thread_read_v1', { p_thread_id: input.threadId, p_idempotency_key: input.idempotencyKey }) as Promise<StaffEmailThreadRead>,
      /** Lista conversas do Email Center com filtros e paginação. (query; contract/staff/email_threads.v1.json) */
      emailThreads: (input: { mailboxId?: string; box?: "all" | "inbox" | "sent"; query?: string; limit?: number; offset?: number } = {}) => call('staff_email_threads_v1', { p_mailbox_id: input.mailboxId, p_box: input.box, p_query: input.query, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffEmailThreads>,
      /** Busca exercícios oficiais com filtros e paginação. (query; contract/staff/exercise_catalog.v1.json) */
      exerciseCatalog: (input: { query?: string; sport?: string; kind?: "exercise" | "technique"; status?: "all" | "active" | "inactive"; limit?: number; offset?: number } = {}) => call('staff_exercise_catalog_v1', { p_query: input.query, p_sport: input.sport, p_kind: input.kind, p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffExerciseCatalogPage>,
      /** Ativa ou desativa exercício oficial sem apagar referências. (command; contract/staff/exercise_catalog_act.v1.json) */
      exerciseCatalogAct: (input: { exerciseId: string; active: boolean; expectedVersion: number; idempotencyKey: string }) => call('staff_exercise_catalog_act_v1', { p_exercise_id: input.exerciseId, p_active: input.active, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingExercise>,
      /** Cria ou altera exercício oficial tipado, localizado e associado a um ou mais esportes. (command; contract/staff/exercise_catalog_save.v1.json) */
      exerciseCatalogSave: (input: { exerciseId: string | null; sportIds: string[]; kind: "exercise" | "technique"; localizations: TrainingExerciseLocalizations; muscles: string[]; equipment: string | null; videoFileId: string | null; thumbFileId: string | null; expectedVersion: number | null; idempotencyKey: string }) => call('staff_exercise_catalog_save_v1', { p_exercise_id: input.exerciseId, p_sport_ids: input.sportIds, p_kind: input.kind, p_localizations: input.localizations, p_muscles: input.muscles, p_equipment: input.equipment, p_video_file_id: input.videoFileId, p_thumb_file_id: input.thumbFileId, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffExercise>,
      /** Prepara e conclui upload R2 inspecionado de vídeo ou miniatura de exercício oficial. (command; contract/staff/exercise_media_upload.v1.json) */
      exerciseMediaUpload: (input: { upload: StaffExerciseMediaUploadCommand }) => invoke('worker', '/staff/exercise-media-upload', { upload: input.upload }) as Promise<StaffExerciseMediaUploadResult>,
      /** Lê a seleção versionada do feed: modo, prioridade de seguidos e proporção. (query; contract/staff/feed_settings.v1.json) */
      feedSettings: () => call('staff_feed_settings_v1', {}) as Promise<StaffFeedSettings>,
      /** Atualiza modo, prioridade de seguidos e proporção do feed com concorrência otimista. (command; contract/staff/feed_settings_save.v1.json) */
      feedSettingsSave: (input: { followedSlots: number; discoverySlots: number; expectedVersion: number; selectionMode?: "global_groups" | "followed_discovery"; prioritizeFollowed?: boolean; ambassadorVideoSeconds?: number }) => call('staff_feed_settings_save_v1', { p_followed_slots: input.followedSlots, p_discovery_slots: input.discoverySlots, p_expected_version: input.expectedVersion, p_selection_mode: input.selectionMode, p_prioritize_followed: input.prioritizeFollowed, p_ambassador_video_seconds: input.ambassadorVideoSeconds }) as Promise<StaffFeedSettings>,
      /** Lista ofertas financeiras e calcula sua prontidão no servidor. (query; contract/staff/financial_offerings.v1.json) */
      financialOfferings: (input: { type?: string | null; status?: string | null; limit?: number; offset?: number } = {}) => call('staff_financial_offerings_v1', { p_type: input.type, p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffFinancialOfferingPage>,
      /** Retorna relatório financeiro tipado para uma moeda, sem mapas abertos. (query; contract/staff/financial_reports.v1.json) */
      financialReports: (input: { from?: string | null; to?: string | null; currency?: string } = {}) => call('staff_financial_reports_v1', { p_from: input.from, p_to: input.to, p_currency: input.currency }) as Promise<StaffFinancialReports>,
      /** Lê os prazos versionados de primeiro contato. (query; contract/staff/first_contact_settings.v1.json) */
      firstContactSettings: () => call('staff_first_contact_settings_v1', {}) as Promise<StaffFirstContactSettings>,
      /** Atualiza os prazos de primeiro contato com concorrência otimista. (command; contract/staff/first_contact_settings_save.v1.json) */
      firstContactSettingsSave: (input: { reminderHours: number; alertHours: number; expectedVersion: number }) => call('staff_first_contact_settings_save_v1', { p_reminder_hours: input.reminderHours, p_alert_hours: input.alertHours, p_expected_version: input.expectedVersion }) as Promise<StaffFirstContactSettings>,
      /** Lista contratos ativos que passaram do prazo sem mensagem do profissional. (query; contract/staff/first_contacts.v1.json) */
      firstContacts: (input: { limit?: number; offset?: number } = {}) => call('staff_first_contacts_v1', { p_limit: input.limit, p_offset: input.offset }) as Promise<StaffFirstContacts>,
      /** Busca a biblioteca oficial de treinos, dietas ou programas com paginação real. (query; contract/staff/health_library.v1.json) */
      healthLibrary: (input: { kind: "workout" | "diet" | "program"; query?: string; sport?: string; status?: "all" | "active" | "inactive"; limit?: number; offset?: number }) => call('staff_health_library_v1', { p_kind: input.kind, p_query: input.query, p_sport: input.sport, p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffHealthLibraryPage>,
      /** Ativa ou desativa um item oficial preservando seu histórico. (command; contract/staff/health_library_act.v1.json) */
      healthLibraryAct: (input: { kind: "workout" | "diet" | "program"; id: string; active: boolean; expectedVersion: number; idempotencyKey: string }) => call('staff_health_library_act_v1', { p_kind: input.kind, p_id: input.id, p_active: input.active, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffHealthLibraryItem>,
      /** Cria ou atualiza um item da biblioteca oficial no agregado canônico. (command; contract/staff/health_library_save.v1.json) */
      healthLibrarySave: (input: { kind: "workout" | "diet" | "program"; id: string | null; payload: StaffHealthLibraryPayload; expectedVersion: number | null; idempotencyKey: string }) => call('staff_health_library_save_v1', { p_kind: input.kind, p_id: input.id, p_payload: input.payload, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffHealthLibraryItem>,
      /** Enfileira convite somente para e-mails ainda sem conta. (command; contract/staff/invite_emails_send.v1.json) */
      inviteEmailsSend: (input: { emails: string[]; idempotencyKey: string }) => call('staff_invite_emails_send_v1', { p_emails: input.emails, p_idempotency_key: input.idempotencyKey }) as Promise<StaffInviteEmailsSendResult>,
      /** Lê a configuração versionada e os totais derivados do acesso por convite. (query; contract/staff/invite_settings.v1.json) */
      inviteSettings: () => call('staff_invite_settings_v1', {}) as Promise<StaffInviteSettings>,
      /** Liga ou desliga o acesso por convite com concorrência otimista. (command; contract/staff/invite_settings_save.v1.json) */
      inviteSettingsSave: (input: { enabled: boolean; expectedVersion: number; idempotencyKey: string }) => call('staff_invite_settings_save_v1', { p_enabled: input.enabled, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffInviteSettings>,
      /** Lista a fila derivada de contas confirmadas sem acesso e liberações feitas pela staff. (query; contract/staff/invite_waitlist.v1.json) */
      inviteWaitlist: (input: { status?: "waiting" | "released"; search?: string; limit?: number; offset?: number } = {}) => call('staff_invite_waitlist_v1', { p_status: input.status, p_search: input.search, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffInviteWaitlist>,
      /** Libera uma conta confirmada e enfileira a boas-vindas na mesma transação. (command; contract/staff/invite_waitlist_release.v1.json) */
      inviteWaitlistRelease: (input: { accountId: string; idempotencyKey: string }) => call('staff_invite_waitlist_release_v1', { p_account_id: input.accountId, p_idempotency_key: input.idempotencyKey }) as Promise<StaffInviteReleaseResult>,
      /** Remove um e-mail da lista sem revogar acesso já concedido. (command; contract/staff/invited_email_remove.v1.json) */
      invitedEmailRemove: (input: { email: string; idempotencyKey: string }) => call('staff_invited_email_remove_v1', { p_email: input.email, p_idempotency_key: input.idempotencyKey }) as Promise<StaffInvitedEmailRemoveResult>,
      /** Lista os e-mails autorizados na fase invite-only. (query; contract/staff/invited_emails.v1.json) */
      invitedEmails: (input: { search?: string; limit?: number; offset?: number } = {}) => call('staff_invited_emails_v1', { p_search: input.search, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffInvitedEmails>,
      /** Inclui e-mails normalizados na lista e libera contas que já aguardavam. (command; contract/staff/invited_emails_add.v1.json) */
      invitedEmailsAdd: (input: { emails: string[]; note: string | null; idempotencyKey: string }) => call('staff_invited_emails_add_v1', { p_emails: input.emails, p_note: input.note, p_idempotency_key: input.idempotencyKey }) as Promise<StaffInvitedEmailsAddResult>,
      /** Ativa ou desativa a versão vigente com concorrência otimista. (command; contract/staff/legal_document_active_save.v1.json) */
      legalDocumentActiveSave: (input: { key: string; active: boolean; expectedRevision: number; idempotencyKey: string }) => call('staff_legal_document_active_save_v1', { p_key: input.key, p_active: input.active, p_expected_revision: input.expectedRevision, p_idempotency_key: input.idempotencyKey }) as Promise<StaffLegalDocumentCurrent>,
      /** Define a jornada da versão vigente com concorrência otimista. (command; contract/staff/legal_document_journey_save.v1.json) */
      legalDocumentJourneySave: (input: { key: string; journey: "signup" | "consultancy_hire" | "become_professional" | "account_deletion" | null; expectedRevision: number; idempotencyKey: string }) => call('staff_legal_document_journey_save_v1', { p_key: input.key, p_journey: input.journey, p_expected_revision: input.expectedRevision, p_idempotency_key: input.idempotencyKey }) as Promise<StaffLegalDocumentCurrent>,
      /** Atesta o PDF no R2 e publica uma versão legal imutável. (command; contract/staff/legal_document_publish.v1.json) */
      legalDocumentPublish: (input: { uploadId: string; key: string; version: string; kind: "acceptance" | "notice" | "declaration"; title: string; description: string; acceptanceText: string; actionLabel: string; isRequired: boolean; sortOrder: number; activate: boolean; expectedRevision: number; idempotencyKey: string }) => invoke('worker', '/staff/legal-document-publish', { upload_id: input.uploadId, key: input.key, version: input.version, kind: input.kind, title: input.title, description: input.description, acceptance_text: input.acceptanceText, action_label: input.actionLabel, is_required: input.isRequired, sort_order: input.sortOrder, activate: input.activate, expected_revision: input.expectedRevision, idempotency_key: input.idempotencyKey }) as Promise<StaffLegalDocumentPublishResult>,
      /** Abre upload assinado de um PDF legal no bucket R2 canônico. (command; contract/staff/legal_document_upload.v1.json) */
      legalDocumentUpload: (input: { filename: string; contentType: "application/pdf"; contentLength: number }) => invoke('worker', '/staff/legal-document-upload', { filename: input.filename, content_type: input.contentType, content_length: input.contentLength }) as Promise<StaffLegalDocumentUpload>,
      /** Lista versões legais imutáveis, configuração vigente e cobertura de aceite. (query; contract/staff/legal_documents.v1.json) */
      legalDocuments: () => call('staff_legal_documents_v1', {}) as Promise<StaffLegalDocumentVersion[]>,
      /** Configura de forma independente a oficialização e o destaque de uma marca. (command; contract/staff/market_store_save.v1.json) */
      marketStoreSave: (input: { store: StaffMarketStoreInput }) => call('staff_market_store_save_v1', { p_store: input.store }) as Promise<StaffMarketStore>,
      /** Lista as marcas configuradas como oficiais ou destaque e os negócios disponíveis. (query; contract/staff/market_stores.v1.json) */
      marketStores: (input: { query?: string | null } = {}) => call('staff_market_stores_v1', { p_query: input.query }) as Promise<StaffMarketStores>,
      /** Suspende ou retoma um acesso sem alterar o ciclo financeiro. (command; contract/staff/member_access_act.v1.json) */
      memberAccessAct: (input: { entitlementId: string; action: "suspend" | "resume"; reason: string; expectedVersion: number; idempotencyKey: string }) => call('staff_member_access_act_v1', { p_entitlement_id: input.entitlementId, p_action: input.action, p_reason: input.reason, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<StaffMemberAccess>,
      /** Lista acessos de membros sem misturar bloqueio administrativo com estado financeiro. (query; contract/staff/member_accesses.v1.json) */
      memberAccesses: (input: { query?: string | null; status?: "active" | "held" | "ended" | null; limit?: number; offset?: number } = {}) => call('staff_member_accesses_v1', { p_query: input.query, p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffMemberAccessPage>,
      /** Consulta a trilha imutável de ações administrativas da área de membros. (query; contract/staff/member_area_audit.v1.json) */
      memberAreaAudit: (input: { from: string; to: string; limit?: number; offset?: number }) => call('staff_member_area_audit_v1', { p_from: input.from, p_to: input.to, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffMemberAreaAuditPage>,
      /** Cria ou atualiza o produto nativo de uma oferta com concorrência otimista. (command; contract/staff/native_product_save.v1.json) */
      nativeProductSave: (input: { product: StaffNativeProductInput }) => call('staff_native_product_save_v1', { p_product: input.product }) as Promise<StaffNativeProductSaved>,
      /** Lista os vínculos configuráveis entre ofertas e produtos das lojas nativas. (query; contract/staff/native_products.v1.json) */
      nativeProducts: () => call('staff_native_products_v1', {}) as Promise<StaffNativeProduct[]>,
      /** Lê a política financeira global em um contrato fechado. (query; contract/staff/payment_settings.v1.json) */
      paymentSettings: () => call('staff_payment_settings_v1', {}) as Promise<StaffPaymentSettings>,
      /** Atualiza integralmente a política financeira com concorrência otimista. (command; contract/staff/payment_settings_save.v1.json) */
      paymentSettingsSave: (input: { settings: StaffPaymentSettingsInput; expectedVersion?: number }) => call('staff_payment_settings_save_v1', { p_settings: input.settings, p_expected_version: input.expectedVersion }) as Promise<StaffPaymentSettings>,
      /** Lista transações financeiras canônicas e paginadas. (query; contract/staff/payment_transactions.v1.json) */
      paymentTransactions: (input: { from?: string | null; to?: string | null; status?: "created" | "pending" | "confirmed" | "settled" | "failed" | "refunded" | "chargeback" | null; settlementStatus?: "pending" | "confirmed" | "settled" | "refunded" | "chargeback" | null; limit?: number; offset?: number } = {}) => call('staff_payment_transactions_v1', { p_from: input.from, p_to: input.to, p_status: input.status, p_settlement_status: input.settlementStatus, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffPaymentTransactionPage>,
      /** Executa transição financeira versionada e auditada de um repasse. (command; contract/staff/payout_act.v1.json) */
      payoutAct: (input: { payoutId: string; action: "approve" | "record" | "finalize" | "reject" | "fail" | "reverse"; expectedVersion: number; paymentReference: string | null; proofFileId: string | null; reason: string | null; idempotencyKey: string }) => call('staff_payout_act_v1', { p_payout_id: input.payoutId, p_action: input.action, p_expected_version: input.expectedVersion, p_payment_reference: input.paymentReference, p_proof_file_id: input.proofFileId, p_reason: input.reason, p_idempotency_key: input.idempotencyKey }) as Promise<StaffPayout>,
      /** Cria lote homogêneo de repasses aprovados. (command; contract/staff/payout_batch_create.v1.json) */
      payoutBatchCreate: (input: { payoutIds: string[]; notes: string | null; idempotencyKey: string }) => call('staff_payout_batch_create_v1', { p_payout_ids: input.payoutIds, p_notes: input.notes, p_idempotency_key: input.idempotencyKey }) as Promise<StaffPayoutBatch>,
      /** Agrupa a fila de repasses por dia. (query; contract/staff/payout_days.v1.json) */
      payoutDays: (input: { limit?: number; offset?: number } = {}) => call('staff_payout_days_v1', { p_limit: input.limit, p_offset: input.offset }) as Promise<StaffPayoutDayPage>,
      /** Prepara, atesta e lê comprovante privado de repasse. (command; contract/staff/payout_proof_upload.v1.json) */
      payoutProofUpload: (input: { upload: StaffPayoutProofCommand }) => invoke('worker', '/staff/payout-proof-upload', { upload: input.upload }) as Promise<StaffPayoutProofResult>,
      /** Lista repasses de um dia com estado e versão canônicos. (query; contract/staff/payouts.v1.json) */
      payouts: (input: { settlementDate: string; limit?: number; offset?: number }) => call('staff_payouts_v1', { p_settlement_date: input.settlementDate, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffPayoutPage>,
      /** Aprova ou rejeita um registro profissional pendente. (command; contract/staff/professional_credential_act.v1.json) */
      professionalCredentialAct: (input: { reviewId: string; action: "approve" | "reject"; reason?: string | null }) => call('staff_professional_credential_act_v1', { p_review_id: input.reviewId, p_action: input.action, p_reason: input.reason }) as Promise<StaffProfessionalCredentialDecision>,
      /** Lista registros profissionais para revisão administrativa. (query; contract/staff/professional_credentials.v1.json) */
      professionalCredentials: (input: { status?: "pending" | "approved" | "rejected"; cursor?: string | null; limit?: number } = {}) => call('staff_professional_credentials_v1', { p_status: input.status, p_cursor: input.cursor, p_limit: input.limit }) as Promise<StaffProfessionalCredentials>,
      /** Lista execuções de conciliação financeira. (query; contract/staff/reconciliation_runs.v1.json) */
      reconciliationRuns: (input: { limit?: number; offset?: number } = {}) => call('staff_reconciliation_runs_v1', { p_limit: input.limit, p_offset: input.offset }) as Promise<StaffReconciliationRunPage>,
      /** Concilia o período com o provedor exclusivamente no worker. (command; contract/staff/reconciliation_start.v1.json) */
      reconciliationStart: (input: { provider: "stripe" | "asaas"; from: string; to: string; idempotencyKey: string }) => invoke('worker', '/staff/reconciliation-start', { provider: input.provider, from: input.from, to: input.to, idempotency_key: input.idempotencyKey }) as Promise<StaffReconciliationRun>,
      /** Mantém ou oculta uma avaliação denunciada. (command; contract/staff/review_report_act.v1.json) */
      reviewReportAct: (input: { reportId: string; action: "keep" | "hide" }) => call('staff_review_report_act_v1', { p_report_id: input.reportId, p_action: input.action }) as Promise<StaffReviewReportDecision>,
      /** Lista denúncias de avaliações para moderação administrativa. (query; contract/staff/review_reports.v1.json) */
      reviewReports: (input: { status?: "pending" | "kept" | "hidden"; limit?: number; offset?: number } = {}) => call('staff_review_reports_v1', { p_status: input.status, p_limit: input.limit, p_offset: input.offset }) as Promise<StaffReviewReports>,
      /** Lê as cotas da biblioteca pessoal aplicadas pelo Core. (query; contract/staff/training_quota.v1.json) */
      trainingQuota: () => call('staff_training_quota_v1', {}) as Promise<StaffTrainingQuota>,
      /** Atualiza a cota gratuita com concorrência otimista. (command; contract/staff/training_quota_save.v1.json) */
      trainingQuotaSave: (input: { freePersonalWorkoutLimit: number; expectedVersion: number }) => call('staff_training_quota_save_v1', { p_free_personal_workout_limit: input.freePersonalWorkoutLimit, p_expected_version: input.expectedVersion }) as Promise<StaffTrainingQuota>,
      /** Registra transferência de tesouraria em lançamento balanceado e imutável. (command; contract/staff/treasury_movement.v1.json) */
      treasuryMovement: (input: { direction: "invest" | "redeem"; amount: number; currency: string; reference: string; note: string | null; idempotencyKey: string }) => call('staff_treasury_movement_v1', { p_direction: input.direction, p_amount: input.amount, p_currency: input.currency, p_reference: input.reference, p_note: input.note, p_idempotency_key: input.idempotencyKey }) as Promise<StaffTreasuryMovement>,
    },
    training: {
      /** Importa um lote do Watch, Apple Saúde ou Health Connect. A execução iniciada no OnlyFit volta com o mesmo id e é enriquecida; repetir não duplica; a mesma execução regravada pela mesma origem vira observação; o vínculo é decidido por dia (J20.7). Lote vazio só reavalia os dias pendentes. (command; contract/training/activities_save.v1.json) */
      activitiesSave: (input: { activities: ImportedActivityInput[]; deleted?: DeletedActivityInput[] }) => call('training_activities_save_v1', { p_activities: input.activities, p_deleted: input.deleted }) as Promise<ActivitiesSaved>,
      /** Detalhe da atividade: provedor, tipo exato, métricas, rota, observações de cada origem, vínculo com confiança e os treinos do dia para corrigir. (query; contract/training/activity.v1.json) */
      activity: (input: { activityId: string }) => call('training_activity_v1', { p_activity_id: input.activityId }) as Promise<Activity>,
      /** Atividade manual, edição de importada (título, modalidade, métricas; o tipo exato recebido não muda e o antes vai para a auditoria), correção de vínculo (vira manual; se o treino escolhido já foi executado no app ou no Watch, a importada vira observação dessa execução, que é devolvida) ou exclusão. (command; contract/training/activity_save.v1.json) */
      activitySave: (input: { activity: ActivitySaveInput }) => call('training_activity_save_v1', { p_activity: input.activity }) as Promise<ActivitySaved>,
      /** Dias de um intervalo (até 62): treinos com estado, minutos de atividade e execuções concluídas no app, manuais ou importadas, com vínculo quando existente. (query; contract/training/calendar.v1.json) */
      calendar: (input: { from: string; to: string }) => call('training_calendar_v1', { p_from: input.from, p_to: input.to }) as Promise<CalendarDay[]>,
      /** Adiciona, remove, reposiciona ou troca uma atribuição do plano do cliente com concorrência otimista. (command; contract/training/client_assignment_act.v1.json) */
      clientAssignmentAct: (input: { businessId: string; clientId: string; programId: string; action: "add" | "remove" | "updateDays" | "swap"; assignmentId?: string | null; sourceWorkoutId?: string | null; weekNumber?: number | null; weekdays?: number[] | null; orderIndex?: number | null; expectedVersion: number; idempotencyKey: string }) => call('training_client_assignment_act_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_program_id: input.programId, p_action: input.action, p_assignment_id: input.assignmentId, p_source_workout_id: input.sourceWorkoutId, p_week_number: input.weekNumber, p_weekdays: input.weekdays, p_order_index: input.orderIndex, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingClientEditorResult>,
      /** Resume sessões concluídas e volume de carga real de um cliente autorizado. (query; contract/training/client_history.v1.json) */
      clientHistory: (input: { businessId: string; clientId: string; from: string; to: string }) => call('training_client_history_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_from: input.from, p_to: input.to }) as Promise<TrainingClientHistory>,
      /** Lê ciclos, atribuições, treinos e a semana do cliente com contrato e consentimento vigentes. (query; contract/training/client_plan.v1.json) */
      clientPlan: (input: { businessId: string; clientId: string; week?: string }) => call('training_client_plan_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_week: input.week }) as Promise<TrainingClientPlan>,
      /** Atribui, libera, oculta ou restaura a cópia independente do programa do cliente. (command; contract/training/client_program_act.v1.json) */
      clientProgramAct: (input: { businessId: string; clientId: string; programId: string | null; action: "assign" | "release" | "hide" | "restore"; sourceProgramId?: string | null; startDate?: string | null; idempotencyKey?: string | null }) => call('training_client_program_act_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_program_id: input.programId, p_action: input.action, p_source_program_id: input.sourceProgramId, p_start_date: input.startDate, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingClientEditorResult>,
      /** Renomeia a cópia do cliente, arquiva o ciclo ou remove seu vínculo lógico sem apagar execuções. (command; contract/training/client_program_edit_act.v1.json) */
      clientProgramEditAct: (input: { businessId: string; clientId: string; programId: string; action: "renameProgram" | "renameWorkout" | "archive" | "unlink"; assignmentId?: string | null; alias?: string | null; expectedProgramVersion: number; expectedWorkoutVersion?: number | null; idempotencyKey: string }) => call('training_client_program_edit_act_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_program_id: input.programId, p_action: input.action, p_assignment_id: input.assignmentId, p_alias: input.alias, p_expected_program_version: input.expectedProgramVersion, p_expected_workout_version: input.expectedWorkoutVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingClientEditorResult>,
      /** Prescreve uma cópia independente em rascunho a partir de modelo privado ou oficial. (command; contract/training/client_protocol_prescribe.v1.json) */
      clientProtocolPrescribe: (input: { businessId: string; clientId: string; sourceKind: "professional" | "platform"; sourceId: string; title: string | null; timezone: string; startDate: string; idempotencyKey: string }) => call('training_client_protocol_prescribe_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_source_kind: input.sourceKind, p_source_id: input.sourceId, p_title: input.title, p_timezone: input.timezone, p_start_date: input.startDate, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingClientProtocol>,
      /** Atualiza título e composição de um protocolo prescrito com concorrência otimista. (command; contract/training/client_protocol_save.v1.json) */
      clientProtocolSave: (input: { businessId: string; clientId: string; protocolId: string; protocol: TrainingClientProtocolInput; expectedVersion: number; idempotencyKey: string }) => call('training_client_protocol_save_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_protocol_id: input.protocolId, p_protocol: input.protocol, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingClientProtocol>,
      /** Ativa, pausa, retoma ou encerra um protocolo prescrito com transições explícitas. (command; contract/training/client_protocol_status_act.v1.json) */
      clientProtocolStatusAct: (input: { businessId: string; clientId: string; protocolId: string; action: "activate" | "pause" | "resume" | "end"; expectedVersion: number; idempotencyKey: string }) => call('training_client_protocol_status_act_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_protocol_id: input.protocolId, p_action: input.action, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingClientProtocol>,
      /** Lista protocolos prescritos ao cliente dentro do contrato e consentimento vigentes. (query; contract/training/client_protocols.v1.json) */
      clientProtocols: (input: { businessId: string; clientId: string }) => call('training_client_protocols_v1', { p_business_id: input.businessId, p_client_id: input.clientId }) as Promise<TrainingClientProtocols>,
      /** Personaliza a cópia do cliente, preservando o modelo e os outros clientes. (command; contract/training/client_workout_save.v1.json) */
      clientWorkoutSave: (input: { businessId: string; clientId: string; programId: string; assignmentId: string; title: string; notes: string; steps: ProfessionalWorkoutStepSaveInput[]; expectedProgramVersion: number; expectedWorkoutVersion: number; idempotencyKey: string }) => call('training_client_workout_save_v1', { p_business_id: input.businessId, p_client_id: input.clientId, p_program_id: input.programId, p_assignment_id: input.assignmentId, p_title: input.title, p_notes: input.notes, p_steps: input.steps, p_expected_program_version: input.expectedProgramVersion, p_expected_workout_version: input.expectedWorkoutVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingClientEditorResult>,
      /** Treinos do dia com passos, mídia, execução no player, desfecho (feito, incompleto, não feito, perdido) e atividade vinculada. (query; contract/training/day.v1.json) */
      day: (input: { date?: string } = {}) => call('training_day_v1', { p_date: input.date }) as Promise<TrainingDay>,
      /** Define explicitamente se um exercício está nos favoritos. (command; contract/training/exercise_favorite_toggle.v1.json) */
      exerciseFavoriteToggle: (input: { exerciseId: string; favorite: boolean; idempotencyKey: string }) => call('training_exercise_favorite_toggle_v1', { p_exercise_id: input.exerciseId, p_favorite: input.favorite, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingExerciseFavoriteResult>,
      /** Lista favoritos visíveis da pessoa, já no formato canônico do exercício. (query; contract/training/exercise_favorites.v1.json) */
      exerciseFavorites: () => call('training_exercise_favorites_v1', {}) as Promise<TrainingExercise[]>,
      /** Busca exercícios ativos ignorando acento e caixa: oficiais e os próprios. (query; contract/training/exercise_search.v1.json) */
      exerciseSearch: (input: { query?: string; sport?: string; muscle?: string; limit?: number; offset?: number } = {}) => call('training_exercise_search_v1', { p_query: input.query, p_sport: input.sport, p_muscle: input.muscle, p_limit: input.limit, p_offset: input.offset }) as Promise<TrainingExercise[]>,
      /** Marca ou desmarca uma etapa do protocolo (feito, não feito com motivo), registra consumo ou desfaz (só hoje e ontem); edita ou exclui a etapa só daquele dia (qualquer data). (command; contract/training/habit_act.v1.json) */
      habitAct: (input: { routineId: string; stepId: string; action: "mark" | "unmark" | "consume" | "undo" | "edit" | "remove"; date?: string; input?: HabitActionInput }) => call('training_habit_act_v1', { p_routine_id: input.routineId, p_step_id: input.stepId, p_action: input.action, p_date: input.date, p_input: input.input }) as Promise<Habits>,
      /** Salva ou exclui protocolo pessoal, inclusive cópia adquirida. Não altera templates profissionais, protocolos de negócio ou prescrições. Excluir é definitivo. (command; contract/training/habit_save.v1.json) */
      habitSave: (input: { routine: RoutineSaveInput }) => call('training_habit_save_v1', { p_routine: input.routine }) as Promise<Habits>,
      /** Meus protocolos: etapas de hoje com a marcação e o histórico dos últimos dias. (query; contract/training/habits.v1.json) */
      habits: (input: { date?: string; historyDays?: number } = {}) => call('training_habits_v1', { p_date: input.date, p_history_days: input.historyDays }) as Promise<Habits>,
      /** Biblioteca: treinos próprios (com a cota), atribuídos (com o profissional), OnlyFit Health (sem criar cópia ao ler) e programas aplicados. (query; contract/training/library.v1.json) */
      library: (input: { sport?: string } = {}) => call('training_library_v1', { p_sport: input.sport }) as Promise<Library>,
      /** Age sobre um treino agendado e devolve o dia atualizado: retirar (3 alcances), marcar feito/não feito, editar conteúdo/horário/data só da ocorrência, trocar exercício só no dia. (command; contract/training/occurrence_act.v1.json) */
      occurrenceAct: (input: { scheduledId: string; action: "remove" | "mark" | "edit" | "swapExercise"; input?: OccurrenceActionInput }) => call('training_occurrence_act_v1', { p_scheduled_id: input.scheduledId, p_action: input.action, p_input: input.input }) as Promise<TrainingDay>,
      /** Arquiva ou restaura um exercício próprio sem apagá-lo. (command; contract/training/professional_exercise_act.v1.json) */
      professionalExerciseAct: (input: { exerciseId: string; action: "archive" | "restore"; expectedVersion: number; idempotencyKey: string }) => call('training_professional_exercise_act_v1', { p_exercise_id: input.exerciseId, p_action: input.action, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingExercise>,
      /** Cria ou altera um exercício próprio tipado, localizado e associado a um ou mais esportes. (command; contract/training/professional_exercise_save.v1.json) */
      professionalExerciseSave: (input: { exerciseId: string | null; sportIds: string[]; kind: "exercise" | "technique"; visibility: "private" | "public"; localizations: TrainingExerciseLocalizations; muscles: string[]; equipment: string | null; videoFileId: string | null; thumbFileId: string | null; expectedVersion: number | null; idempotencyKey: string }) => call('training_professional_exercise_save_v1', { p_exercise_id: input.exerciseId, p_sport_ids: input.sportIds, p_kind: input.kind, p_visibility: input.visibility, p_localizations: input.localizations, p_muscles: input.muscles, p_equipment: input.equipment, p_video_file_id: input.videoFileId, p_thumb_file_id: input.thumbFileId, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingExercise>,
      /** Biblioteca de modelos próprios da conta e da equipe do negócio atual, sem prescrições nem cópias adquiridas. (query; contract/training/professional_library.v1.json) */
      professionalLibrary: (input: { businessId: string }) => call('training_professional_library_v1', { p_business_id: input.businessId }) as Promise<TrainingProfessionalLibrary>,
      /** Lista separadamente modelos privados do negócio e modelos oficiais clonáveis. (query; contract/training/professional_protocol_library.v1.json) */
      professionalProtocolLibrary: (input: { businessId: string }) => call('training_professional_protocol_library_v1', { p_business_id: input.businessId }) as Promise<TrainingProfessionalProtocolLibrary>,
      /** Lê um modelo profissional com composição integralmente tipada. (query; contract/training/professional_protocol_template.v1.json) */
      professionalProtocolTemplate: (input: { businessId: string; templateId: string }) => call('training_professional_protocol_template_v1', { p_business_id: input.businessId, p_template_id: input.templateId }) as Promise<TrainingProfessionalProtocolTemplate>,
      /** Arquiva um modelo profissional preservando prescrições históricas. (command; contract/training/professional_protocol_template_archive.v1.json) */
      professionalProtocolTemplateArchive: (input: { businessId: string; templateId: string; expectedVersion: number; idempotencyKey: string }) => call('training_professional_protocol_template_archive_v1', { p_business_id: input.businessId, p_template_id: input.templateId, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingArchivedProtocolTemplate>,
      /** Cria, clona ou salva atomicamente um modelo profissional versionado. (command; contract/training/professional_protocol_template_save.v1.json) */
      professionalProtocolTemplateSave: (input: { businessId: string; templateId: string | null; template: TrainingProfessionalProtocolTemplateInput; expectedVersion: number | null; idempotencyKey: string }) => call('training_professional_protocol_template_save_v1', { p_business_id: input.businessId, p_template_id: input.templateId, p_template: input.template, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingProfessionalProtocolTemplate>,
      /** Cria ou atualiza atomicamente um modelo de treino do negócio com concorrência otimista. (command; contract/training/professional_workout_save.v1.json) */
      professionalWorkoutSave: (input: { businessId: string; workoutId: string | null; title: string; sportId: string; notes: string; steps: ProfessionalWorkoutStepSaveInput[]; expectedVersion: number | null; idempotencyKey: string }) => call('training_professional_workout_save_v1', { p_business_id: input.businessId, p_workout_id: input.workoutId, p_title: input.title, p_sport_id: input.sportId, p_notes: input.notes, p_steps: input.steps, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<ProfessionalWorkoutTemplate>,
      /** Um programa canônico, modelo ou aplicação da pessoa, com versão, ocorrências e progresso. (query; contract/training/program.v1.json) */
      program: (input: { programId: string }) => call('training_program_v1', { p_program_id: input.programId }) as Promise<TrainingProgram>,
      /** Aplica, reagenda ou remove um programa com concorrência otimista e replay exato. (command; contract/training/program_act.v1.json) */
      programAct: (input: { programId: string; action: "apply" | "reschedule" | "remove"; startDate: string | null; expectedVersion: number; idempotencyKey: string }) => call('training_program_act_v1', { p_program_id: input.programId, p_action: input.action, p_start_date: input.startDate, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingProgramActionResult>,
      /** Salva o modelo do negócio ou a cópia comprada da biblioteca pessoal (business_id nulo e id obrigatório), sem alterar a versão adquirida ou aplicações existentes. (command; contract/training/program_save.v1.json) */
      programSave: (input: { program: TrainingProgramSaveInput }) => call('training_program_save_v1', { p_program: input.program }) as Promise<TrainingProgramSaveResult>,
      /** Duplica, arquiva ou restaura um modelo profissional com concorrência otimista. (command; contract/training/program_template_act.v1.json) */
      programTemplateAct: (input: { businessId: string; programId: string; action: "duplicate" | "archive" | "restore"; expectedVersion: number; idempotencyKey: string }) => call('training_program_template_act_v1', { p_business_id: input.businessId, p_program_id: input.programId, p_action: input.action, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingProfessionalProgram>,
      /** Grava os passos realizados em lote e, com finish, encerra. Tudo ou nada; repetir dá o mesmo resultado. (command; contract/training/session_save.v1.json) */
      sessionSave: (input: { sessionId: string; steps?: SessionStepInput[]; finish?: boolean; review?: SessionReviewInput }) => call('training_session_save_v1', { p_session_id: input.sessionId, p_steps: input.steps, p_finish: input.finish, p_review: input.review }) as Promise<Session>,
      /** Inicia (ou retoma) a sessão de um treino agendado ou avulso autorizado. Congela o prescrito. (command; contract/training/session_start.v1.json) */
      sessionStart: (input: { scheduledId?: string; idempotencyKey: string; workoutId?: string }) => call('training_session_start_v1', { p_scheduled_id: input.scheduledId, p_idempotency_key: input.idempotencyKey, p_workout_id: input.workoutId }) as Promise<Session>,
      /** Um treino: próprio, atribuído ou fonte OnlyFit Health, com a origem e se é editável. (query; contract/training/workout.v1.json) */
      workout: (input: { workoutId: string }) => call('training_workout_v1', { p_workout_id: input.workoutId }) as Promise<WorkoutDetail>,
      /** schedule {dates} (fonte OnlyFit Health vira uma cópia só, J16.72) · archive (treino próprio) · removeFromLibrary (atribuído; o original não muda). Devolve a biblioteca. (command; contract/training/workout_act.v1.json) */
      workoutAct: (input: { workoutId: string; action: "schedule" | "archive" | "removeFromLibrary"; input?: WorkoutActionInput }) => call('training_workout_act_v1', { p_workout_id: input.workoutId, p_action: input.action, p_input: input.input }) as Promise<Library>,
      /** Salva um treino próprio; com datas, entra na agenda na hora (J16.69). Treino prescrito não é editado (J16.63). (command; contract/training/workout_save.v1.json) */
      workoutSave: (input: { workout: WorkoutSaveInput }) => call('training_workout_save_v1', { p_workout: input.workout }) as Promise<WorkoutDetail>,
      /** Lê as zonas fisiológicas privadas usadas pelos motores de treino. (query; contract/training/zones.v1.json) */
      zones: () => call('training_zones_v1', {}) as Promise<TrainingZones>,
      /** Salva zonas fisiológicas com concorrência otimista e repetição segura. (command; contract/training/zones_save.v1.json) */
      zonesSave: (input: { cyclingFtpWatts: number | null; runningThresholdPaceSecondsPerKm: number | null; thresholdHeartRateBpm: number | null; maxHeartRateBpm: number | null; swimmingCssSecondsPer100m: number | null; expectedVersion: number; idempotencyKey: string }) => call('training_zones_save_v1', { p_cycling_ftp_watts: input.cyclingFtpWatts, p_running_threshold_pace_seconds_per_km: input.runningThresholdPaceSecondsPerKm, p_threshold_heart_rate_bpm: input.thresholdHeartRateBpm, p_max_heart_rate_bpm: input.maxHeartRateBpm, p_swimming_css_seconds_per_100m: input.swimmingCssSecondsPer100m, p_expected_version: input.expectedVersion, p_idempotency_key: input.idempotencyKey }) as Promise<TrainingZones>,
    },
  };
}

export type OnlyFitApi = ReturnType<typeof createApi>;
