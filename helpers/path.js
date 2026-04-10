function resolveBaseUrl() {
  return process.env.baseUrl || '/';
}

export default {
  resolveBaseUrl,
};
