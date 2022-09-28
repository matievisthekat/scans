import React, {useEffect, useRef, useState} from 'react';
import {Chart, Legend, LineElement, PointElement, RadarController, RadialLinearScale, Tooltip} from "chart.js";
import AnswerOptions from "./AnswerOptions";
import {CategorizedAnswers, Category, Question} from "../util/types";
import parseCsv from '../util/parseCsv';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Legend, Tooltip);

interface ScanProps {
  scanName: string;
}

function fetchCsv<T>(type: 'Questions' | 'Categories', name: string): Promise<T[]> {
  return new Promise(async (resolve, reject) => {
    fetch(`/${name}/${type}.csv`).then(async (res) => {
      if (!res.ok) {
        reject(res.statusText);
      } else {
        const data = await res.text();
        resolve(parseCsv(data) as any);
      }
    }).catch((err) => reject(err.message))
  });
}

function onSubmit(categories: Category[], questions: Question[], email: string) {
  // for development. DON'T COMMIT THIS IF IT ISN'T COMMENTED OUT
  questions = questions.map((q) => {
    return { ...q, answer: Math.round(Math.random() * 5) }
  });

  const categorizedAnswers: CategorizedAnswers[] = [];
  for (const category of categories) {
    const categoryQuestions = questions.filter((q) => q.category_number === category.category_number);
    const total = categoryQuestions.reduce((prev, curr) => prev + (curr.answer ?? 0), 0);
    categorizedAnswers.push({ category_number: category.category_number, category_name: category.category_name, total });
  }

  Chart.getChart('chart')?.destroy();

  new Chart('chart', {
    type: 'radar',
    data: {
      labels: categories.map((c) => c.category_name),
      datasets: [{
        label: 'Total',
        data: categorizedAnswers.map((a) => a.total),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }]
    },
    options: {
      scales: {
        x: {
          type: 'radialLinear',
          beginAtZero: true,
          max: 80,
          min: 0
        },
        y: {
          type: 'radialLinear',
          beginAtZero: true,
          max: 80,
          min: 0
        }
      },
    }
  });

  fetch("/api/save", {
    method: "POST",
    body: JSON.stringify({
      totals: categorizedAnswers,
      email
    })
  });
}

function Scan({scanName}: ScanProps) {
  const [error, setError] = useState<String | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [latestShownQuestion, setLatestShownQuestion] = useState(-1);
  const [email, setEmail] = useState<string | null>(null);

  const scrollToRef = useRef<HTMLElement>(null);

  let allQuestionsHaveAnswers = questions.length > 0;
  for (const question of questions) {
    if (question.answer === undefined || question.answer === null) allQuestionsHaveAnswers = false;
  }

  useEffect(() => {
    fetchCsv<Category>('Categories', scanName).then((categories) => {
      setCategories(categories);
      fetchCsv<Question>('Questions', scanName).then((questions) => {
        setQuestions(questions);
        setLatestShownQuestion(0);

        // for development. DON'T COMMIT THIS IF IT ISN'T COMMENTED OUT
        setQuestions(
          questions.map((q) => {
            return { ...q, answer: Math.round(Math.random() * 5) }
          })
        );
      }).catch((err) => setError(err));
    }).catch((err) => setError(err));
  }, [scanName]);

  return (
    <>
      <header>
        <h1>{scanName.replace(/_/g, ' ')}</h1>
        {error && <div className="error">{error}</div>}
      </header>
      <main>
        {questions.map((q, i) => {
          return (
            <section key={i} ref={i === latestShownQuestion + 1 ? scrollToRef : null} id={`section-${i}`} className={`q-and-a ${i === latestShownQuestion ? 'shown' : 'hidden'}`}>
              <div className='question'>
                <h2>{q.question}</h2>
              </div>
              <AnswerOptions
                disabled={i !== latestShownQuestion}
                onChange={(v) => {
                  let quesCopy = [...questions];
                  let ques = quesCopy.find((question) => question.question_number === q.question_number);
                  if (ques) {
                    ques.answer = v;
                    quesCopy[quesCopy.indexOf(ques)] = ques;
                    setQuestions(quesCopy);
                    setLatestShownQuestion(quesCopy.indexOf(ques) + 1);
                    document.getElementById(`section-${i + 1}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                  }
                }}
              />
            </section>
          );
        })}
        {allQuestionsHaveAnswers && (
          <>
            <h4 id={'thank-you-text'}>
              Thank you for completing the Navigating Retirement Scan. Please click <a href={'#results'} onClick={() => {
                if (email) {
                  onSubmit(categories, questions, email);
                } else {
                  setEmail(prompt("Please enter your email address"));
                }
              }}>here</a> to view your results.
            </h4>
            <section id={'results'}>
              <div>
                <canvas id='chart' width={'800vw'} height={'800vw'}></canvas>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default Scan;