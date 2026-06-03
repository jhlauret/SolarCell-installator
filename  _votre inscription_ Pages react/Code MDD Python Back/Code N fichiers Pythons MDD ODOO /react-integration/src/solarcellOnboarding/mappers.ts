import type { SkillsPayload, TrainingCoursePayload } from './types';

export function mapDefaultSkillsFromUi(): SkillsPayload {
  return {
    skills: [
      { code: 'panneaux_solaires', label: 'Panneaux solaires', level: 'advanced' },
      { code: 'onduleurs', label: 'Onduleurs', level: 'intermediate' },
      { code: 'batteries', label: 'Batteries', level: 'intermediate' },
      { code: 'cables_cablage', label: 'Câbles & câblage', level: 'advanced' },
    ],
  };
}

export function mapDefaultTrainingFromUi(): TrainingCoursePayload[] {
  return [
    { code: 'pv_site_safety', title: 'Sécurité sur les chantiers photovoltaïques', progress: 100, status: 'completed' },
    { code: 'solar_panel_installation', title: 'Installation de panneaux solaires', progress: 100, status: 'completed' },
    { code: 'inverter_installation_configuration', title: 'Installation et configuration des onduleurs', progress: 25, status: 'in_progress' },
    { code: 'solar_battery_systems', title: 'Systèmes de batteries solaires', progress: 0, status: 'not_started' },
    { code: 'electrical_cabling_protections', title: 'Câblage et protections électriques', progress: 0, status: 'not_started' },
  ];
}
