
const Footer = ()=> {

const currenyear = new Date().getFullYear()

    return (

        <footer className="bg-gray-600 border-t border-gray-700 py-4">
          <div className="container-app">
            <p className="text-sm text-gray-400 text-center">DevFinance{currenyear}- Desenvoldido por 
                <strong>Kevin meneses</strong>. {''}
                <strong>Typescript</strong> & <strong>React</strong>
            </p>
          </div>
        </footer>
    )
}

export default Footer