import React, { useState, useRef } from 'react';
import cn from 'classnames';
import { useStaticQuery, graphql } from 'gatsby';
import { object, string } from 'yup';
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

const schema = object({
  challenge: string().required(),
  title: string().required(),
  url: string().required().url(),
  image: string().required(),
  authorName: string().required().label('Your name'),
  authorUrl: string().required().label('Your website').url(),
  authorEmail: string().required().label('Your email')
});

const PassengerShowcaseForm = () => {
  const ref = useRef();
  const [state, setState] = useState(defaultState);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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
    setError(null);
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

    // Read the file into a base64 blob
    const file = ref.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result.replace('data:image/png;base64,', '');
      const submitState = Object.assign({}, state, {
        image: base64
      });
      try {
        const response = await fetch(
          '/.netlify/functions/submission-background',
          {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitState)
          }
        );
        if (response.ok) {
          setSubmitted(true);
          setState(defaultState);
        } else {
          setError(
            'Something went wrong submitting your data. Please try again.'
          );
        }
      } catch (e) {
        setError(
          'Something went wrong submitting your data. Please try again.'
        );
      }
    };
    reader.onerror = function (error) {
      setError('Something went wrong parsing your image.');
    };
  };

  return (
    <div className={css.root}>
      <form onSubmit={onSubmit} className={css.form}>
        <label>
          Challenge
          <select name="challenge" value={state.challenge} onChange={onChange}>
            <option value="">Select a challenge</option>
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
            type="email"
            name="authorEmail"
            value={state.authorEmail}
            onChange={onChange}
          />
          <span>Your email address.</span>
        </label>
        {error && <div className={css.error}>{error}</div>}
        {submitted && (
          <div className={css.submitted}>
            Thank you for submitting to the Passenger Showcase!
          </div>
        )}
        <Button onClick={onSubmit} variant="purple" disabled={submitted}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PassengerShowcaseForm;
