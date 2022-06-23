import React, { useState, useRef } from 'react';
import cn from 'classnames';
import { useStaticQuery, graphql } from 'gatsby';
import Button from './Button';
import * as css from './PassengerShowcaseForm.module.css';

// event.body expected to be:
// {
//   title: "Something",
//   image: "base64string="
//   authorName: "Rune Madsen",
//   authorUrl: "https://runemadsen.com",
//   authorEmail: "rune@runemadsen.com",
//   url: "https://runemadsen.github.io/rune.js/",
//   challenge: "01-test",
// }

const defaultState = {
  challenge: '',
  title: '',
  url: '',
  image: '',
  authorName: '',
  authorUrl: '',
  authorEmail: ''
};

const PassengerShowcaseForm = () => {
  const ref = useRef();
  const [state, setState] = useState(defaultState);

  const data = useStaticQuery(graphql`
    query {
      challenges: allChallenge(sort: { order: DESC, fields: date }) {
        nodes {
          title
          slug
          videoNumber
        }
      }
    }
  `);

  const onChange = (e) => {
    setState(Object.assign({}, state, { [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // TODO: Check that everything has been filled out

    // read the file into a base64 blob
    const file = ref.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const base64 = reader.result.replace('data:image/png;base64,', '');
      const submitState = Object.assign({}, state, {
        image: base64
      });
      console.log('SUBMIT!', submitState);
    };
    reader.onerror = function (error) {
      // TODO: ERROR
    };
  };

  return (
    <div className={css.root}>
      <form onSubmit={onSubmit} className={css.form}>
        <label>
          Challenge
          <select name="challenge" value={state.challenge} onChange={onChange}>
            {data.challenges.nodes.map((node) => {
              let label = `#${node.videoNumber} ${node.title}`;
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
            Select the challenge you are submitting to the passenger showcase.
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
            A link to either the source code (p5.js editor, GitHub) or a video
            (YouTube, Vimeo).{' '}
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
            A PNG image to be shown in the passenger showcase list. The image
            should be maximum 800 pixels wide and should represent the output of
            your code.
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
          <span>A link to your personal website or social media profile.</span>
        </label>
        <label>
          Your e-mail
          <input
            type="text"
            name="authorEmail"
            value={state.authorEmail}
            onChange={onChange}
          />
          <span>Your email address.</span>
        </label>
        <Button onClick={onSubmit} variant="purple">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PassengerShowcaseForm;
