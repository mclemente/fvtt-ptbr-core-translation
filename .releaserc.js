module.exports = {
  branches: [
    'master',
    {
      name: 'beta',
      prerelease: true
    }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits'
      }
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/exec',
      {
        publishCmd: 'curl --header \"JOB-TOKEN: $CI_JOB_TOKEN\" --upload-file module.zip $PACKAGE_REGISTRY_URL/$VERSION/module.zip && curl --header \"JOB-TOKEN: $CI_JOB_TOKEN\" --upload-file module.json $PACKAGE_REGISTRY_URL/$VERSION/module.json'
      }
    ],
    [
      '@semantic-release/gitlab',
      {
        successComment: false,
        failComment: false,
        failTitle: false,
        assets: [
          {
            url: `${process.env.PACKAGE_REGISTRY_URL}/${process.env.VERSION}/module.zip`,
            label: 'module.zip',
            type: 'package',
            filepath: '/module.zip'
          },
          {
            url: `${process.env.PACKAGE_REGISTRY_URL}/${process.env.VERSION}/module.json`,
            label: 'module.json',
            filepath: '/module.json'
          }
        ]
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'package.json',
          'module.json'
        ],
        message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}'
      }
    ]
  ]
}
