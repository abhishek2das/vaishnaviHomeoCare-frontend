export const BASE_URL = 'http://192.168.1.33:8091/api';

export const API_ENDPOINTS = {
  PATIENTS: {
    GET_ALL: `${BASE_URL}/patients`,
    GET_BY_ID: (id) => `${BASE_URL}/patients/${id}`,
    CREATE: `${BASE_URL}/patients`,
    UPDATE: (id) => `${BASE_URL}/patients/${id}`,
    DELETE: (id) => `${BASE_URL}/patients/${id}`,
  },
  PATIENT_HISTORY: {
    GET_ALL: (patientId) => `${BASE_URL}/patients/${patientId}/history`,
    CREATE: (patientId) => `${BASE_URL}/patients/${patientId}/history`,
    UPDATE: (historyId) => `${BASE_URL}/patients/history/${historyId}`,
    DELETE: (historyId) => `${BASE_URL}/patients/history/${historyId}`,
  },
  TESTIMONIALS: {
    GET_ALL: `${BASE_URL}/testimonials`,
    CREATE: `${BASE_URL}/testimonials`,
    UPDATE: (id) => `${BASE_URL}/testimonials/${id}`,
    DELETE: (id) => `${BASE_URL}/testimonials/${id}`,
  },
  PRESS_RELEASES: {
    GET_ALL: `${BASE_URL}/press-releases`,
    CREATE: `${BASE_URL}/press-releases`,
    UPDATE: (id) => `${BASE_URL}/press-releases/${id}`,
    DELETE: (id) => `${BASE_URL}/press-releases/${id}`,
  },
  GALLERY: {
    GET_ALL: `${BASE_URL}/gallery`,
    CREATE: `${BASE_URL}/gallery`,
    DELETE: (id) => `${BASE_URL}/gallery/${id}`
  },
  AWARDS: {
    GET_ALL: `${BASE_URL}/awards`,
    CREATE: `${BASE_URL}/awards`,
    UPDATE: (id) => `${BASE_URL}/awards/${id}`,
    DELETE: (id) => `${BASE_URL}/awards/${id}`,
  },
  FAQS: {
    GET_ALL: `${BASE_URL}/faqs`,
    CREATE: `${BASE_URL}/faqs`, 
    UPDATE: (id) => `${BASE_URL}/faqs/${id}`,
    DELETE: (id) => `${BASE_URL}/faqs/${id}`,
  },
  CONTACTS: {
    GET_ALL: `${BASE_URL}/contacts`,
    CREATE: `${BASE_URL}/contacts`,
    DELETE: (id) => `${BASE_URL}/contacts/${id}`,
  },
  APPOINTMENTS: {
    GET_ALL: `${BASE_URL}/appointments`,
    CREATE: `${BASE_URL}/appointments`,
    UPDATE: (id) => `${BASE_URL}/appointments/${id}`,
    DELETE: (id) => `${BASE_URL}/appointments/${id}`,
  },
  DASHBOARD: {
    STATS: `${BASE_URL}/dashboard/stats`,
    RECENT_APPOINTMENTS: (limit = 5) => `${BASE_URL}/dashboard/recent-appointments?limit=${limit}`,
    RECENT_PATIENTS: (limit = 5) => `${BASE_URL}/dashboard/recent-patients?limit=${limit}`,
  },
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
  },
  SERVICES: {
    GET_ALL: `${BASE_URL}/cms/services`,
    CREATE: `${BASE_URL}/cms/services`,
    UPDATE: (id) => `${BASE_URL}/cms/services/${id}`,
    DELETE: (id) => `${BASE_URL}/cms/services/${id}`,
  },
  CMS: {
    ABOUT: `${BASE_URL}/cms/about`,
    STATS: {
      GET_ALL: `${BASE_URL}/cms/stats`,
      POST: `${BASE_URL}/cms/stats`,
      UPDATE: (id) => `${BASE_URL}/cms/stats/${id}`,
      DELETE: (id) => `${BASE_URL}/cms/stats?id=${id}`,
    },
    DOCTORS: {
      GET_ALL: `${BASE_URL}/cms/doctors`,
      POST: `${BASE_URL}/cms/doctors`,
      UPDATE: (id) => `${BASE_URL}/cms/doctors/${id}`,
      DELETE: (id) => `${BASE_URL}/cms/doctors?id=${id}`,
    },
  },
};
