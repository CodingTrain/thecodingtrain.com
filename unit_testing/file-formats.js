const video = undefined;
const track = undefined;
const mainTrack = undefined;
const sideTrack = undefined;
const contribution = undefined;
const talk = {
  title: {
    isRequired: true,
    type: 'string'
  },
  meta: {
    isRequired: true,
    type: 'string'
  },
  description: {
    isRequired: true,
    type: 'string'
  },
  link: {
    isRequired: true,
    type: 'string'
  }
};
const collaborator = undefined;

module.exports = {
  video,
  mainTrack,
  sideTrack,
  contribution,
  talk,
  collaborator
};
