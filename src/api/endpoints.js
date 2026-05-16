export const BASE_URL = 'http://192.168.1.34:8091/api';

export const API_ENDPOINTS = {
  PATIENTS: {
    GET_ALL: `${BASE_URL}/patients`,
    GET_BY_ID: (id) => `${BASE_URL}/patients/${id}`,
    CREATE: `${BASE_URL}/patients`,
    UPDATE: (id) => `${BASE_URL}/patients/${id}`,
    DELETE: (id) => `${BASE_URL}/patients/${id}`,
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
    CREATE: `${BASE_URL}/gallery`
  }
};
