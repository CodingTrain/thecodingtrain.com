const {
  video,
  mainTrack,
  sideTrack,
  contribution,
  talk,
  collaborator
} = require('./file-formats.js');

const contentStructure = {
  folders: {
    videos: {
      folders: {
        challenges: {
          folders: {
            '': {
              folders: {
                contributions: {
                  files: {
                    '': { isRequired: false, jsonFormat: contribution }
                  },
                  folder: {},
                  isRequired: false,
                  isFileSensitive: false,
                  isFolderSensitive: true
                },
                src: {
                  files: {},
                  folder: {},
                  isRequired: false,
                  isFileSensitive: false,
                  isFolderSensitive: false
                }
              },
              files: {
                'index.json': { isRequired: true, jsonFormat: video },
                'index.jpg': { isRequired: false },
                'index.png': { isRequired: false }
              },
              isFileSensitive: true,
              isFolderSensitive: true,
              isRequired: false
            }
          },
          files: {
            'placeholder.png': {
              isRequired: true,
              requiredAlternative: 'placeholder.jpg'
            },
            'placeholder.jpg': {
              isRequired: true,
              requiredAlternative: 'placeholder.png'
            }
          },
          isFileSensitive: true,
          isFolderSensitive: false,
          isRequired: true
        },
        lessons: {
          folders: {
            '': {
              folders: {
                contributions: {
                  files: {
                    '': { isRequired: false, jsonFormat: contribution }
                  },
                  folder: {},
                  isRequired: false,
                  isFileSensitive: false,
                  isFolderSensitive: true
                },
                src: {
                  files: {},
                  folder: {},
                  isRequired: false,
                  isFileSensitive: false,
                  isFolderSensitive: false
                }
              },
              files: {
                'index.json': { isRequired: true, jsonFormat: video },
                'index.jpg': { isRequired: false },
                'index.png': { isRequired: false }
              },
              isFileSensitive: true,
              isFolderSensitive: true,
              isRequired: false
            }
          },
          files: {
            'placeholder.png': {
              isRequired: true,
              requiredAlternative: 'placeholder.jpg'
            },
            'placeholder.jpg': {
              isRequired: true,
              requiredAlternative: 'placeholder.png'
            }
          },
          isFileSensitive: true,
          isFolderSensitive: false,
          isRequired: true
        },
        'guest-tutorials': {
          folders: {
            '': {
              folders: {
                contributions: {
                  files: {
                    '': { isRequired: false, jsonFormat: contribution }
                  },
                  folder: {},
                  isRequired: false,
                  isFileSensitive: false,
                  isFolderSensitive: true
                },
                src: {
                  files: {},
                  folder: {},
                  isRequired: false,
                  isFileSensitive: false,
                  isFolderSensitive: false
                }
              },
              files: {
                'index.json': { isRequired: true, jsonFormat: video },
                'index.jpg': { isRequired: false },
                'index.png': { isRequired: false }
              },
              isFileSensitive: true,
              isFolderSensitive: true,
              isRequired: false
            }
          },
          files: {
            'placeholder.png': {
              isRequired: true,
              requiredAlternative: 'placeholder.jpg'
            },
            'placeholder.jpg': {
              isRequired: true,
              requiredAlternative: 'placeholder.png'
            }
          },
          isFileSensitive: true,
          isFolderSensitive: false,
          isRequired: true
        }
      },
      files: {},
      isFileSensitive: true,
      isFolderSensitive: true,
      isRequired: true
    },
    tracks: {
      folders: {
        'main-tracks': {
          folders: {
            '': {
              folders: {},
              files: {
                'index.json': { isRequired: true, jsonFormat: mainTrack },
                'index.jpg': { isRequired: false },
                'index.png': { isRequired: false }
              },
              isFileSensitive: true,
              isFolderSensitive: true,
              isRequired: false
            }
          },
          files: {
            'placeholder.png': {
              isRequired: true,
              requiredAlternative: 'placeholder.jpg'
            },
            'placeholder.jpg': {
              isRequired: true,
              requiredAlternative: 'placeholder.png'
            }
          },
          isFileSensitive: true,
          isFolderSensitive: false,
          isRequired: true
        },
        'side-tracks': {
          folders: {
            '': {
              folders: {},
              files: {
                'index.json': { isRequired: true, jsonFormat: sideTrack },
                'index.jpg': { isRequired: false },
                'index.png': { isRequired: false }
              },
              isFileSensitive: true,
              isFolderSensitive: true,
              isRequired: false
            }
          },
          files: {
            'placeholder.png': {
              isRequired: true,
              requiredAlternative: 'placeholder.jpg'
            },
            'placeholder.jpg': {
              isRequired: true,
              requiredAlternative: 'placeholder.png'
            }
          },
          isFileSensitive: true,
          isFolderSensitive: false,
          isRequired: true
        }
      },
      files: {},
      isFileSensitive: true,
      isFolderSensitive: true,
      isRequired: true
    },
    guides: {
      folders: {},
      files: {},
      isFileSensitive: false,
      isFolderSensitive: true,
      isRequired: true
    },
    talks: {
      folders: {},
      files: { '': { isRequired: false, jsonFormat: talk } },
      isFileSensitive: false,
      isFolderSensitive: true,
      isRequired: true
    }
  },
  files: {
    'collaborators.json': { isRequired: true, jsonFormat: collaborator },
    'content-structure-guide.md': { isRequired: false }
  },
  isFileSensitive: true,
  isFolderSensitive: true,
  isRequired: true
};

module.exports = { contentStructure };
