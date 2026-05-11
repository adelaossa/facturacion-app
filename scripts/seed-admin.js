const { Pool } = require('pg');
const bcrypt = require('bcrypt');

//use: npm run seed:admin -- --nombre "Admin" --email admin@test.com --password secret123

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--nombre') args.nombre = argv[++i];
    else if (argv[i] === '--email') args.email = argv[++i];
    else if (argv[i] === '--password') args.password = argv[++i];
  }
  return args;
}

function usage() {
  console.error('Uso: npm run seed:admin -- --nombre <name> --email <email> --password <pass>');
  process.exit(1);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.nombre || !args.email || !args.password) {
    console.error('Error: --nombre, --email y --password son obligatorios.');
    usage();
  }

  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'facturacion',
    password: 'facturacion123',
    database: 'facturacion',
  });

  try {
    const hashedPassword = await bcrypt.hash(args.password, 10);

    const result = await pool.query(
      `INSERT INTO auth."usuario" (nombre, email, password, rol)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email, rol`,
      [args.nombre, args.email, hashedPassword],
    );

    if (result.rowCount === 0) {
      console.log(`El usuario ${args.email} ya existe. No se realizaron cambios.`);
    } else {
      const row = result.rows[0];
      console.log(`Admin creado: ${row.email} (id=${row.id}, rol=${row.rol})`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
