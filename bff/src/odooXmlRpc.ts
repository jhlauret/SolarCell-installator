import axios from 'axios';
import { config } from './config';

const BASE = () => config.odoo.url.replace(/\/$/, '');

// ── Session persistante ────────────────────────────────────────────────────────
let _sessionCookie = '';
let _uid: number | null = null;

async function ensureSession(): Promise<string> {
  if (_uid && _sessionCookie) return _sessionCookie;

  const resp = await axios.post(
    `${BASE()}/web/session/authenticate`,
    {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db: config.odoo.db,
        login: config.odoo.adminUser,
        password: config.odoo.adminPassword,
      },
    },
    { headers: { 'Content-Type': 'application/json' }, timeout: 15000 },
  );

  if (!resp.data?.result?.uid) {
    throw new Error('Authentification Odoo admin échouée');
  }

  _uid = resp.data.result.uid as number;
  const setCookie = resp.headers['set-cookie'];
  _sessionCookie = Array.isArray(setCookie) ? setCookie.map(c => c.split(';')[0]).join('; ') : ((setCookie ?? '').split(';')[0]);
  return _sessionCookie;
}

// ── Appel JSON-RPC /web/dataset/call_kw ───────────────────────────────────────
async function call(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
): Promise<unknown> {
  const cookie = await ensureSession();
  const { data } = await axios.post(
    `${BASE()}/web/dataset/call_kw`,
    {
      jsonrpc: '2.0',
      method: 'call',
      params: { model, method, args, kwargs: { context: {}, ...kwargs } },
    },
    { headers: { 'Content-Type': 'application/json', Cookie: cookie }, timeout: 15000 },
  );

  if (data?.error) {
    // Session expirée → reset et retry une fois
    if (data.error?.data?.name === 'odoo.http.SessionExpiredException' || data.error?.code === 100) {
      _uid = null;
      _sessionCookie = '';
      return call(model, method, args, kwargs);
    }
    const msg = data.error?.data?.message ?? data.error?.message ?? 'Erreur Odoo';
    throw new Error(`Odoo [${model}.${method}]: ${msg}`);
  }
  return data?.result;
}

// ── API publique ──────────────────────────────────────────────────────────────

export async function odooSearch(model: string, domain: unknown[]): Promise<number[]> {
  return call(model, 'search', [domain]) as Promise<number[]>;
}

export async function odooCreate(model: string, vals: Record<string, unknown>): Promise<number> {
  return call(model, 'create', [vals]) as Promise<number>;
}

export async function odooWrite(model: string, ids: number[], vals: Record<string, unknown>): Promise<boolean> {
  return call(model, 'write', [ids, vals]) as Promise<boolean>;
}

export async function odooRead(model: string, ids: number[], fields: string[]): Promise<Record<string, unknown>[]> {
  return call(model, 'read', [ids, fields]) as Promise<Record<string, unknown>[]>;
}

export async function odooUpsert(
  model: string,
  domain: unknown[],
  vals: Record<string, unknown>,
): Promise<number> {
  const ids = await odooSearch(model, domain);
  if (ids.length) {
    await odooWrite(model, [ids[0]], vals);
    return ids[0];
  }
  return odooCreate(model, vals);
}
