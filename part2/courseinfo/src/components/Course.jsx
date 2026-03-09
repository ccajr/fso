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

export default Course