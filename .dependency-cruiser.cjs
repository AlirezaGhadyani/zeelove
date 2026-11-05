/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'domain-depends-on-nothing-internal',
      comment: 'Domain layer must not depend on application, infrastructure, or presentation',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/domain' },
      to: { path: '^src/modules/[^/]+/(application|infrastructure|presentation)' },
    },
    {
      name: 'application-depends-only-on-domain-or-ports',
      comment: 'Application layer must not depend on infrastructure or presentation',
      severity: 'error',
      from: { path: '^src/modules/[^/]+/application' },
      to: { path: '^src/modules/[^/]+/(infrastructure|presentation)' },
    },
    {
      name: 'cross-context-must-use-index',
      comment: 'Contexts must only talk through another module index.ts',
      severity: 'error',
      from: { path: '^src/modules/([^/]+)' },
      to: {
        path: '^src/modules/([^/]+)',
        pathNot: ['^src/modules/$1', '^src/modules/[^/]+/index\\.ts$'],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};
