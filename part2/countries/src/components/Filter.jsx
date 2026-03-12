const Filter = ({ filter, onChange }) => (
    <div>
      find countries <input value={filter} onChange={onChange} />
    </div>
)

export default Filter