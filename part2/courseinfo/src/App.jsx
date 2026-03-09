const Course = ({ name, parts }) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <div>
      <SubHeader course={name} />
      <Content parts={parts} />
      <Total total={total} />
    </div>
  )
}

const Header = (props) => <h1>{props.text}</h1>

const SubHeader = (props) => <h2>{props.course}</h2>

const Content = ({ parts }) => (
  <div>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <h4>total of {props.total} exercises</h4>

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <Header text="Web development curriculum" />
      {courses.map(course => 
        <Course key={course.id} name={course.name} parts={course.parts} />
      )}
    </div>
  )
}

export default App