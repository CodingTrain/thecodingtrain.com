import React from 'react';
import { graphql } from 'gatsby';
export default function Component(props) {
  console.log({ props });
  const { track } = props.data;
  return track.title + props.params.slug;
}

export const query = graphql`
  query ($id: String) {
    track(id: { eq: $id }) {
      title
      slug
      description
      numVideos
      type
      chapters {
        title
        videos {
          title
        }
      }
    }
  }
`;
