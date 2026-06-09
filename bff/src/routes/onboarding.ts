import { Router } from 'express';
import { odooUpsert, odooSearch, odooRead, odooCreate, odooWrite } from '../odooXmlRpc';

export const onboardingRouter = Router();

/**
 * Middleware : vérifie que applicationId est présent dans le body.
 * Toutes les routes d'onboarding requièrent un dossier déjà créé par /auth/login.
 */
function requireAppId(req: any, res: any, next: any) {
  const id = Number(req.body?.applicationId ?? req.query?.applicationId);
  if (!id) return res.status(400).json({ error: 'bad_request', message: 'applicationId requis.' });
  req.applicationId = id;
  next();
}

// ── GET /api/onboarding/data ──────────────────────────────────────────────────
onboardingRouter.get('/data', async (req, res) => {
  const applicationId = Number(req.query.applicationId);
  if (!applicationId) return res.status(400).json({ error: 'bad_request', message: 'applicationId requis.' });

  try {
    // Personal
    const installerIds = await odooSearch('x_solarcell_installer', [['x_application_id', '=', applicationId]]);
    if (!installerIds.length) return res.json({});

    const installerId = installerIds[0];
    const [inst] = await odooRead('x_solarcell_installer', [installerId], [
      'x_first_name', 'x_last_name', 'x_email', 'x_phone',
      'x_address', 'x_zip', 'x_city', 'x_country',
      'x_birth_date', 'x_birth_country', 'x_nationality',
      'x_preferred_lang', 'x_timezone',
    ]);

    const personal = {
      firstName:    str(inst.x_first_name),
      lastName:     str(inst.x_last_name),
      email:        str(inst.x_email),
      phone:        str(inst.x_phone),
      address:      str(inst.x_address),
      zip:          str(inst.x_zip),
      city:         str(inst.x_city),
      country:      str(inst.x_country),
      birthDate:    str(inst.x_birth_date),
      birthCountry: str(inst.x_birth_country),
      nationality:  str(inst.x_nationality),
      preferredLang: str(inst.x_preferred_lang) || 'fr',
      timezone:     str(inst.x_timezone),
    };

    // Professional
    let professional: Record<string, unknown> | undefined;
    const compIds = await odooSearch('x_solarcell_installer_company', [['x_installer_id', '=', installerId]]);
    if (compIds.length) {
      const [comp] = await odooRead('x_solarcell_installer_company', [compIds[0]], [
        'x_company_type', 'x_name', 'x_siret', 'x_vat_number', 'x_ape_code',
        'x_pro_address', 'x_pro_zip', 'x_pro_city', 'x_pro_country',
        'x_pro_phone', 'x_pro_email', 'x_creation_year', 'x_employee_range', 'x_main_activity',
      ]);
      professional = {
        companyType:   str(comp.x_company_type),
        companyName:   str(comp.x_name),
        siret:         str(comp.x_siret),
        vatNumber:     str(comp.x_vat_number),
        apeCode:       str(comp.x_ape_code),
        proAddress:    str(comp.x_pro_address),
        proZip:        str(comp.x_pro_zip),
        proCity:       str(comp.x_pro_city),
        proCountry:    str(comp.x_pro_country),
        proPhone:      str(comp.x_pro_phone),
        proEmail:      str(comp.x_pro_email),
        creationYear:  comp.x_creation_year ? String(comp.x_creation_year) : '',
        employeeRange: str(comp.x_employee_range),
        mainActivity:  str(comp.x_main_activity),
      };
    }

    // Skills
    const skillIds = await odooSearch('x_solarcell_installer_skill', [['x_installer_id', '=', installerId]]);
    let skills: Record<string, unknown> | undefined;
    if (skillIds.length) {
      const skillRecs = await odooRead('x_solarcell_installer_skill', skillIds, [
        'x_domain', 'x_level', 'x_years_experience', 'x_installations',
      ]);
      const selected = skillRecs.map((s: any) => str(s.x_domain)).filter(Boolean);
      const levels: Record<string, string> = {};
      let yearsExperience = '';
      let installations = '';
      for (const s of skillRecs as any[]) {
        if (s.x_domain) levels[s.x_domain] = str(s.x_level) || 'intermediate';
        if (s.x_years_experience) yearsExperience = str(s.x_years_experience);
        if (s.x_installations) installations = str(s.x_installations);
      }
      skills = { selected, levels, yearsExperience, installations };
    }

    // Wallet
    const walletIds = await odooSearch('x_solarcell_installer_wallet', [['x_installer_id', '=', installerId]]);
    let wallet: Record<string, unknown> | undefined;
    if (walletIds.length) {
      const [w] = await odooRead('x_solarcell_installer_wallet', [walletIds[0]], [
        'x_wallet_type', 'x_recovery_confirmed',
      ]);
      wallet = {
        walletType: str(w.x_wallet_type) || 'integrated',
        recoveryConfirmed: Boolean(w.x_recovery_confirmed),
      };
    }

    return res.json({ personal, professional, skills, wallet });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

function str(val: unknown): string {
  if (!val || val === false) return '';
  return String(val);
}

// ── GET /api/onboarding/status ────────────────────────────────────────────────
onboardingRouter.get('/status', async (req, res) => {
  const applicationId = Number(req.query.applicationId);
  if (!applicationId) return res.status(400).json({ error: 'bad_request', message: 'applicationId requis.' });

  try {
    const ids = await odooSearch('x_solarcell_installer', [['x_application_id', '=', applicationId]]);
    if (!ids.length) {
      return res.json({ exists: false, completedSteps: [], onboardingStep: null, status: 'draft' });
    }
    const [rec] = await odooRead('x_solarcell_installer', [ids[0]], [
      'x_status', 'x_onboarding_step', 'x_completed_steps',
    ]);
    let completedSteps: string[] = [];
    try {
      const raw = rec.x_completed_steps;
      if (raw && raw !== false) completedSteps = JSON.parse(raw as string);
    } catch { /* noop */ }
    return res.json({
      exists: true,
      installerId: ids[0],
      status: rec.x_status,
      onboardingStep: rec.x_onboarding_step,
      completedSteps,
    });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

// ── POST /api/onboarding/personal ────────────────────────────────────────────
onboardingRouter.post('/personal', requireAppId, async (req, res) => {
  const { applicationId } = req as any;
  const {
    firstName, lastName, birthDate, birthCountry, nationality,
    email, phone, address, zip, city, country,
    preferredLang, timezone,
  } = req.body;

  try {
    const installerId = await odooUpsert(
      'x_solarcell_installer',
      [['x_application_id', '=', applicationId]],
      {
        x_name: `${firstName ?? ''} ${lastName ?? ''}`.trim() || `Installateur #${applicationId}`,
        x_application_id: applicationId,
        x_email: email,
        x_onboarding_step: 'personal',
        // Données personnelles stockées directement sur le dossier
        x_first_name:    firstName ?? false,
        x_last_name:     lastName ?? false,
        x_birth_date:    birthDate ?? false,
        x_birth_country: birthCountry ?? false,
        x_nationality:   nationality ?? false,
        x_phone:         phone ?? false,
        x_address:       address ?? false,
        x_zip:           zip ?? false,
        x_city:          city ?? false,
        x_country:       country ?? false,
        x_preferred_lang: preferredLang ?? 'fr',
        x_timezone:      timezone ?? false,
      },
    );

    await markStep(installerId, 'personal');
    return res.json({ ok: true, installerId, step: 'personal' });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

// ── POST /api/onboarding/professional ────────────────────────────────────────
onboardingRouter.post('/professional', requireAppId, async (req, res) => {
  const { applicationId } = req as any;
  const {
    companyType, companyName, siret, vatNumber, apeCode,
    proAddress, proZip, proCity, proCountry, proPhone, proEmail,
    creationYear, employeeRange, mainActivity,
  } = req.body;

  try {
    const installerId = await getInstallerId(applicationId);
    await odooUpsert(
      'x_solarcell_installer_company',
      [['x_installer_id', '=', installerId]],
      {
        x_name: companyName ?? `Entreprise – dossier ${applicationId}`,
        x_installer_id: installerId,
        x_company_type: companyType,
        x_siret: siret,
        x_vat_number: vatNumber,
        x_ape_code: apeCode,
        x_pro_address: proAddress,
        x_pro_zip: proZip,
        x_pro_city: proCity,
        x_pro_country: proCountry,
        x_pro_phone: proPhone,
        x_pro_email: proEmail,
        x_creation_year: creationYear ?? false,
        x_employee_range: employeeRange,
        x_main_activity: mainActivity,
      },
    );

    await markStep(installerId, 'professional');
    return res.json({ ok: true, installerId, step: 'professional' });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

// ── POST /api/onboarding/skills ───────────────────────────────────────────────
onboardingRouter.post('/skills', requireAppId, async (req, res) => {
  const { applicationId } = req as any;
  // skills : [{ domain, level }]
  // experience : { yearsExperience, installations }
  const { skills = [], yearsExperience, installations } = req.body;

  try {
    const installerId = await getInstallerId(applicationId);

    for (const sk of skills as Array<{ domain: string; level: string }>) {
      await odooUpsert(
        'x_solarcell_installer_skill',
        [['x_installer_id', '=', installerId], ['x_domain', '=', sk.domain]],
        {
          x_name: `${sk.domain} – dossier ${applicationId}`,
          x_installer_id: installerId,
          x_domain: sk.domain,
          x_level: sk.level,
          x_years_experience: yearsExperience,
          x_installations: installations,
        },
      );
    }

    await markStep(installerId, 'skills');
    return res.json({ ok: true, installerId, step: 'skills', skillsCount: skills.length });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

// ── POST /api/onboarding/documents ───────────────────────────────────────────
onboardingRouter.post('/documents', requireAppId, async (req, res) => {
  const { applicationId } = req as any;
  // documents : [{ docType, category, filename, mimetype, fileBase64 }]
  const { documents = [] } = req.body;

  try {
    const installerId = await getInstallerId(applicationId);

    for (const doc of documents as Array<{
      docType: string; category: string; filename: string; mimetype: string; fileBase64?: string;
    }>) {
      await odooUpsert(
        'x_solarcell_installer_document',
        [['x_installer_id', '=', installerId], ['x_doc_type', '=', doc.docType]],
        {
          x_name: doc.filename ?? doc.docType,
          x_installer_id: installerId,
          x_doc_type: doc.docType,
          x_category: doc.category,
          x_filename: doc.filename,
          x_mimetype: doc.mimetype,
          ...(doc.fileBase64 ? { x_file: doc.fileBase64 } : {}),
          x_status: 'pending',
        },
      );
    }

    await markStep(installerId, 'documents');
    return res.json({ ok: true, installerId, step: 'documents', docsCount: documents.length });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

// ── POST /api/onboarding/wallet ───────────────────────────────────────────────
onboardingRouter.post('/wallet', requireAppId, async (req, res) => {
  const { applicationId } = req as any;
  const { walletType, walletAddress, blockchain, recoveryConfirmed } = req.body;

  try {
    const installerId = await getInstallerId(applicationId);
    await odooUpsert(
      'x_solarcell_installer_wallet',
      [['x_installer_id', '=', installerId]],
      {
        x_name: `Wallet – dossier ${applicationId}`,
        x_installer_id: installerId,
        x_wallet_type: walletType ?? 'integrated',
        x_wallet_address: walletAddress ?? false,
        x_blockchain: blockchain ?? false,
        x_recovery_confirmed: recoveryConfirmed ?? false,
        x_status: recoveryConfirmed ? 'active' : 'pending',
      },
    );

    await markStep(installerId, 'wallet');
    return res.json({ ok: true, installerId, step: 'wallet' });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

// ── POST /api/onboarding/finalize ─────────────────────────────────────────────
// Soumet le dossier après la dernière étape (wallet). Le modèle Odoo n'a pas de
// statut « soumis » dédié (valeurs : draft / in_progress / validated / rejected) ;
// « validated » étant réservé à la validation admin, on marque le dossier
// « in_progress » et on efface l'étape courante (x_onboarding_step = false) pour
// signaler que le parcours est terminé et en attente de validation. Finalisation
// indulgente : on ne ré-exige pas les 7 étapes (contract n'est pas persisté côté BFF).
onboardingRouter.post('/finalize', requireAppId, async (req, res) => {
  const { applicationId } = req as any;
  try {
    const installerId = await getInstallerId(applicationId);
    await odooWrite('x_solarcell_installer', [installerId], {
      x_status: 'in_progress',
      x_onboarding_step: false,
    });
    return res.json({ ok: true, installerId, status: 'submitted' });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

// ── POST /api/onboarding/training ─────────────────────────────────────────────
onboardingRouter.post('/training', requireAppId, async (req, res) => {
  const { applicationId } = req as any;
  // progresses : [{ courseKey, progress, status }]
  const { progresses = [] } = req.body;

  try {
    const installerId = await getInstallerId(applicationId);

    for (const p of progresses as Array<{ courseKey: string; progress: number; status: string }>) {
      const moduleIds = await odooSearch('x_solarcell_training_module', [['x_course_key', '=', p.courseKey]]);
      if (!moduleIds.length) continue;
      const moduleId = moduleIds[0];

      const existing = await odooSearch('x_solarcell_training_progress', [
        ['x_installer_id', '=', installerId],
        ['x_module_id', '=', moduleId],
      ]);
      const vals: Record<string, unknown> = {
        x_name: `${p.courseKey} – dossier ${applicationId}`,
        x_installer_id: installerId,
        x_module_id: moduleId,
        x_progress: p.progress,
        x_status: p.status,
        x_last_activity: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      if (p.status === 'in_progress' && !existing.length) {
        vals.x_started_on = vals.x_last_activity;
      }
      if (p.status === 'completed') {
        vals.x_completed_on = vals.x_last_activity;
      }
      if (existing.length) {
        await odooWrite('x_solarcell_training_progress', [existing[0]], vals);
      } else {
        await odooCreate('x_solarcell_training_progress', vals);
      }
    }

    const allCompleted = progresses.length > 0 && progresses.every((p: any) => p.status === 'completed');
    if (allCompleted) await markStep(installerId, 'training');
    return res.json({ ok: true, installerId, step: 'training', updatedCount: progresses.length });
  } catch (err: unknown) {
    return res.status(502).json({ error: 'odoo_error', message: (err as Error).message });
  }
});

// ── Helpers internes ──────────────────────────────────────────────────────────

async function getInstallerId(applicationId: number): Promise<number> {
  const ids = await odooSearch('x_solarcell_installer', [['x_application_id', '=', applicationId]]);
  if (!ids.length) throw new Error(`Aucun dossier x_solarcell_installer pour applicationId=${applicationId}. Appelez d'abord POST /personal.`);
  return ids[0];
}

async function markStep(installerId: number, step: string): Promise<void> {
  const [rec] = await odooRead('x_solarcell_installer', [installerId], ['x_completed_steps', 'x_onboarding_step']);
  let steps: string[] = [];
  try {
    const raw = rec.x_completed_steps;
    if (raw && raw !== false) steps = JSON.parse(raw as string);
  } catch { /* noop */ }
  if (!steps.includes(step)) steps.push(step);

  const ORDER = ['personal', 'professional', 'skills', 'documents', 'training', 'contract', 'wallet'];
  const nextStep = ORDER.find(s => !steps.includes(s)) ?? 'wallet';

  await odooWrite('x_solarcell_installer', [installerId], {
    x_completed_steps: JSON.stringify(steps),
    x_onboarding_step: nextStep,
    x_status: steps.length >= 6 ? 'in_progress' : 'draft',
  });
}
