import { X } from 'lucide-react';
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react';

export type AmbassadorTabItem<T extends string> = {
  id: T;
  label: string;
  icon: ReactNode;
};

export function AmbassadorTabs<T extends string>({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: T;
  items: AmbassadorTabItem<T>[];
  onChange: (value: T) => void;
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    onChange(items[next].id);
    buttons.current[next]?.focus();
  };

  return (
    <div className="ambassador-tabs-wrap">
      <div className="ambassador-tabs" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            aria-controls={`ambassador-panel-${item.id}`}
            aria-selected={value === item.id}
            className={value === item.id ? 'active' : ''}
            id={`ambassador-tab-${item.id}`}
            key={item.id}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => move(event, index)}
            ref={(node) => { buttons.current[index] = node; }}
            role="tab"
            tabIndex={value === item.id ? 0 : -1}
            type="button"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AmbassadorTabPanel({ id, activeTab, children }: { id: string; activeTab: string; children: ReactNode }) {
  if (id !== activeTab) return null;
  return (
    <div
      aria-labelledby={`ambassador-tab-${id}`}
      id={`ambassador-panel-${id}`}
      role="tabpanel"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

export function CloseButton({ label = 'Fechar', disabled = false, onClick }: { label?: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button aria-label={label} className="icon-button" disabled={disabled} onClick={onClick} type="button">
      <X aria-hidden="true" size={18} />
    </button>
  );
}

export function AmbassadorDialog({
  open,
  title,
  eyebrow,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'primary',
  pending = false,
  confirmDisabled = false,
  children,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  eyebrow?: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  pending?: boolean;
  confirmDisabled?: boolean;
  children?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const cancelHandler = useRef(onCancel);
  const pendingState = useRef(pending);
  useEffect(() => {
    cancelHandler.current = onCancel;
    pendingState.current = pending;
  }, [onCancel, pending]);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => cancelRef.current?.focus());
    const keydown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !pendingState.current) cancelHandler.current();
      if (event.key !== 'Tab') return;
      const dialog = cancelRef.current?.closest('[role="dialog"]');
      const focusable = dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [open]);

  if (!open) return null;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!pending && !confirmDisabled) void onConfirm();
  };

  return (
    <div className="ambassador-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !pending) onCancel();
    }}>
      <form
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className="ambassador-modal"
        onSubmit={submit}
        role="dialog"
      >
        <div className="ambassador-panel-head">
          <div>
            {eyebrow ? <span>{eyebrow}</span> : null}
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <CloseButton disabled={pending} label="Fechar diálogo" onClick={onCancel} />
        </div>
        {children}
        <div className="ambassador-editor-actions">
          <button className="button secondary" disabled={pending} onClick={onCancel} ref={cancelRef} type="button">{cancelLabel}</button>
          <button className={`button ${tone}`} disabled={pending || confirmDisabled} type="submit">{confirmLabel}</button>
        </div>
      </form>
    </div>
  );
}
