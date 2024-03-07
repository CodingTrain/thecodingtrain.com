import React, { useState, useRef, useMemo } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { object, string, boolean } from 'yup';
import { useLocation } from '@reach/router';

import Button from './Button';

import * as css from './PassengerShowcaseForm.module.css';

// event.body expected to be:
// {
//   title: "Something",
//   image: "base64string=",
//   authorName: "Coding Train",
//   authorUrl: "https://thecodingtrain.com",
//   authorEmail: "help@thecodingtrain.com",
//   authorTwitter: "@thecodingtrain",
//   authorInstagram: "@the.coding.train"
//   url: "https://thecodingtrain.com/tracks",
//   track: "challenges",
//   video: "01-starfield",
//   socialPermission: true
// }

const defaultState = {
  track: '',
  video: '',
  title: '',
  url: '',
  image: '',
  authorName: '',
  authorUrl: '',
  authorEmail: '',
  authorTwitter: '',
  authorInstagram: '',
  socialPermission: true
};

const schema = object({
  track: string().required(),
  video: string().required(),
  title: string().required(),
  url: string().required().url(),
  image: string().required(),
  authorName: string().required().label('Your name'),
  authorUrl: string().label('Your website').url(),
  authorEmail: string().label('Your email'),
  authorTwitter: string().label('Twitter'),
  authorInstagram: string().label('Instagram'),
  socialPermission: boolean().required()
});

const useVideosWithShowcase = function () {
  const data = useStaticQuery(graphql`
    query {
      challenges: allChallenge(sort: { date: DESC }) {
        nodes {
          title
          slug
          videoNumber
        }
      }
      tracks: allTrack {
        nodes {
          title
          slug
          chapters {
            title
            videos {
              title
              slug
              canContribute
              canonicalTrack {
                slug
              }
            }
          }
          videos {
            title
            slug
            canContribute
            canonicalTrack {
              slug
            }
          }
        }
      }
    }
  `);

  return useMemo(() => {
    const tracks = data.tracks.nodes
      .map((track) => {
        // keep only videos that can be contributed to
        // keep only videos that belong to this track
        const videoFilter = (video) =>
          video.canContribute && video.canonicalTrack?.slug === track.slug;

        track.videos = track.videos?.filter(videoFilter);
        track.chapters = track.chapters
          ?.map((chapter) => {
            chapter.videos = chapter.videos.filter(videoFilter);
            return chapter;
          })
          .filter((chapter) => chapter.videos.length);

        return track;
      })
      .filter((track) => track.videos?.length || track.chapters?.length);

    // create a "challenges track"
    const challengesTrack = {
      title: 'Coding Challenges',
      slug: 'challenges',
      videos: data.challenges.nodes.map((node) => {
        return {
          title: `#${node.videoNumber} ${node.title}`,
          slug: node.slug
        };
      })
    };
    return [challengesTrack, ...tracks];
  }, [data]);
};

const PassengerShowcaseForm = () => {
  const location = useLocation();
  const ref = useRef();
  const [state, setState] = useState({
    ...defaultState,
    track: location.state?.track ?? '',
    video: location.state?.video ?? ''
  });
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const data = useVideosWithShowcase();

  const onChange = (e) => {
    setError(null);
    if (e.target.name === 'track') {
      setState(
        Object.assign({}, state, {
          track: e.target.value,
          video: ''
        })
      );
      return;
    }
    if (e.target.name === 'socialPermission') {
      setState(
        Object.assign({}, state, { [e.target.name]: e.target.value == 'true' })
      );
      return;
    }
    setState(Object.assign({}, state, { [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Check that everything has been filled out
    try {
      await schema.validate(state, { strict: true });
    } catch (e) {
      setError(e.toString().replace('ValidationError: ', ''));
      return;
    }

    // Handle the uploaded image
    const file = ref.current.files[0];

    // Check that the image is not over 500kb
    const fileKb = file.size / 1000;
    if (fileKb > 500) {
      setError(
        'The uploaded image is larger than 500kb. Please upload a JPG or PNG that is maximum 800 pixels wide and 500kb in size.'
      );
      return;
    }

    // Read the file into a base64 blob
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result
        .replace('data:image/png;base64,', '')
        .replace('data:image/jpeg;base64,', '');

      const submitState = Object.assign({}, state, { image: base64 });
      try {
        const response = await fetch('/.netlify/functions/submission-sync', {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitState)
        });
        const json = await response.json();
        if (response.ok) {
          setSubmitted(true);
          setState(defaultState);
        } else {
          setError(
            json.error ||
              'Oh no! The train broke down. Please contact help@thecodingtrain.com to report the malfunction!'
          );
        }
      } catch (e) {
        setError(
          'Oh no! The train broke down. Please contact help@thecodingtrain.com to report the malfunction!'
        );
      }
    };
    reader.onerror = function (error) {
      setError('Something went wrong parsing your image.');
    };
  };

  const selectedTrack = data.find((track) => track.slug === state.track);

  return (
    <div className={css.root}>
      <form onSubmit={onSubmit} className={css.form}>
        <label>
          Track
          <select name="track" value={state.track} onChange={onChange}>
            <option value="">Select a track</option>
            {data.map((node) => {
              let label = node.title;
              if (label.length > 50) {
                label = label.substring(0, 50) + '...';
              }
              return (
                <option value={node.slug} key={node.slug}>
                  {label}
                </option>
              );
            })}
          </select>
          <span>
            Select the track you are submitting to the passenger showcase.
          </span>
        </label>
        <label>
          Video
          <select name="video" value={state.video} onChange={onChange}>
            <option value="">Select a video</option>

            {selectedTrack?.chapters?.map((node) => (
              <optgroup label={node.title} key={node.title}>
                {node.videos.map((video) => {
                  let label = video.title;
                  if (label.length > 50) {
                    label = label.substring(0, 50) + '...';
                  }
                  return (
                    <option value={video.slug} key={video.slug}>
                      {label}
                    </option>
                  );
                })}
              </optgroup>
            ))}

            {selectedTrack?.videos?.map((node) => {
              let label = node.title;
              if (label.length > 50) {
                label = label.substring(0, 50) + '...';
              }
              return (
                <option value={node.slug} key={node.slug}>
                  {label}
                </option>
              );
            })}
          </select>
          <span>
            Select the video you are submitting to the passenger showcase.
          </span>
        </label>
        <label>
          Title
          <input
            type="text"
            name="title"
            value={state.title}
            onChange={onChange}
          />
          <span>
            The title for your submission which will be shown above the uploaded
            image in the passenger showcase.
          </span>
        </label>
        <label>
          URL
          <input
            type="text"
            name="url"
            placeholder="https://"
            value={state.url}
            onChange={onChange}
          />
          <span>
            A link to any kind of documentation of your project (blog post,
            p5.js editor sketch, GitHub repo, video).
          </span>
        </label>
        <label>
          Image
          <input
            ref={ref}
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            value={state.image}
            onChange={onChange}
          />
          <span>
            A JPG or PNG image to be shown in the passenger showcase. The image
            should be maximum 800 pixels wide and 500 kb in size and should
            visually represent your work. The image will be displayed with a
            16:9 aspect ratio.
          </span>
        </label>
        <label>
          Your name
          <input
            type="text"
            name="authorName"
            value={state.authorName}
            onChange={onChange}
          />
          <span>
            Your name to be shown on the passenger showcase submission.
          </span>
        </label>
        <label>
          Your website
          <input
            type="text"
            name="authorUrl"
            placeholder="https://"
            value={state.authorUrl}
            onChange={onChange}
          />
          <span>
            <em>Optional</em>. A link to your personal website or social media
            profile.
          </span>
        </label>
        <label>
          Your e-mail
          <input
            type="email"
            name="authorEmail"
            value={state.authorEmail}
            onChange={onChange}
          />
          <span>
            <em>Optional</em>. Your email address (This is not stored, but
            rather used to match your GitHub account and assign commits for the
            submission.)
          </span>
        </label>
        <label>Social media permission</label>
        <label>
          <span className={css.radioLabel}>
            <input
              type="radio"
              name="socialPermission"
              value="true"
              checked={state.socialPermission}
              onChange={onChange}
            />
            The Cafe Car: You have my permission to share this project to other
            Coding Train social media platforms!
          </span>
        </label>
        <label>
          <span className={css.radioLabel}>
            <input
              type="radio"
              name="socialPermission"
              value="false"
              checked={!state.socialPermission}
              onChange={onChange}
            />
            By private carriage: I prefer this project to be featured on the
            Coding Train website only.
          </span>
        </label>
        <label>
          Twitter
          <input
            type="text"
            name="authorTwitter"
            value={state.authorTwitter}
            onChange={onChange}
          />
          <span>
            <em>Optional</em>. We are not currently featuring the showcase on
            Twitter/X, but feel free to leave your handle if you’d like to be
            tagged and credited if and when we do.
          </span>
        </label>
        <label>
          Instagram
          <input
            type="text"
            name="authorInstagram"
            value={state.authorInstagram}
            onChange={onChange}
          />
          <span>
            <em>Optional</em>. We are featuring the showcase on Instagram!
            Please leave your handle if you’d like to be tagged and credited!
          </span>
        </label>
        {error && <div className={css.error}>{error}</div>}
        {submitted && (
          <div className={css.submitted}>
            Thank you for submitting to the Passenger Showcase! Please refresh
            the page in order to upload another submission.
          </div>
        )}
        <Button
          className={css.submitBtn}
          onClick={onSubmit}
          variant="purple"
          disabled={submitted}
          rainbow>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PassengerShowcaseForm;
