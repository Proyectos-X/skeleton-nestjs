module.exports = {
  pgSettings: {
    // Puedes establecer search_path si tienes múltiples esquemas
    search_path: "app_public,public",
  },
  placeholders: {
    // Ejemplo: ":CURRENT_USER" será reemplazado por el valor de la env var CURRENT_USER
    ":CURRENT_USER": process.env.CURRENT_USER,
  },
  afterReset: [
    // "afterReset.sql"
  ],
  afterAllMigrations: [],
  afterCurrent: []
};
