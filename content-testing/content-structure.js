const contentStructure = {
  folders: {
    videos: {
      folders: {
        challenges: {
          folders: {
            '': {
              folders: {
                showcase: {
                  files: {
                    '': { isRequired: false }
                  },
                  folder: {},
                  isRequired: false,
                  isFileSensitive: false,
                  isFolderSensitive: true
                },
                images: {
                  files: {},
                  folder: {},
                  isRequired: false,
                  isFileSensitive: false,
                  isFolderSensitive: true
                }
              },
              files: {
                'index.json': {
                  isRequired: true
                },
                'index.jpg': { isRequired: false },
                'index.png': { isRequired: false }
              },
              canBeRecursive: true,
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
        '': {
          folders: {
            showcase: {
              files: {
                '': { isRequired: false }
              },
              folder: {},
              isRequired: false,
              isFileSensitive: false,
              isFolderSensitive: true
            },
            images: {
              files: {},
              folder: {},
              isRequired: false,
              isFileSensitive: false,
              isFolderSensitive: true
            }
          },
          files: {
            'index.json': {
              isRequired: true
            },
            'index.jpg': { isRequired: false },
            'index.png': { isRequired: false }
          },
          canBeRecursive: true,
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
    tracks: {
      folders: {
        'main-tracks': {
          folders: {
            '': {
              folders: {},
              files: {
                'index.json': {
                  isRequired: true
                },
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
                'index.json': {
                  isRequired: true
                },
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
      files: {
        'index.json': {
          isRequired: false
        }
      },
      isFileSensitive: true,
      isFolderSensitive: true,
      isRequired: true
    },
    pages: {
      folders: {
        faqs: {
          files: {
            'index.json': {
              isRequired: true
            },
            '': {
              isRequired: false
            }
          },
          folder: {},
          isRequired: false,
          isFileSensitive: false,
          isFolderSensitive: true
        },
        guides: {
          folders: {},
          files: {},
          isFileSensitive: false,
          isFolderSensitive: false,
          isRequired: true
        },
        about: {
          folders: {},
          files: {},
          isFileSensitive: false,
          isFolderSensitive: false,
          isRequired: true
        },
        tracks: {
          folders: {},
          files: {},
          isFileSensitive: false,
          isFolderSensitive: true,
          isRequired: true
        },
        challenges: {
          folders: {},
          files: {},
          isFileSensitive: false,
          isFolderSensitive: true,
          isRequired: true
        },
        homepage: {
          folders: {},
          files: {},
          isFileSensitive: false,
          isFolderSensitive: true,
          isRequired: true
        },
        showcase: {
          folders: {},
          files: {},
          isFileSensitive: false,
          isFolderSensitive: true,
          isRequired: true
        },
        404: {
          folders: {},
          files: {},
          isFileSensitive: false,
          isFolderSensitive: true,
          isRequired: true
        }
      },
      files: {},
      isFileSensitive: true,
      isFolderSensitive: true,
      isRequired: true
    },
    templates: {
      folders: {},
      files: {},
      isFileSensitive: false,
      isFolderSensitive: false,
      isRequired: false
    }
  },
  files: {},
  isFileSensitive: true,
  isFolderSensitive: true,
  isRequired: true
};

module.exports = { contentStructure };
