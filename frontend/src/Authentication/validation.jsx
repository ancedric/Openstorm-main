function validation(formData){
    let errors = {}
    if(!formData.username){
        errors.username = 'Provide a username'
        } else {
            errors.username = ''
        }
    if(!formData.firstname){
        errors.firstname = 'Cannot be empty'
    } else {
        errors.firstname = ''
    }
    if(!formData.lastname){
        errors.lastname = 'cannot be empty'
    } else {
        errors.lastname = ''
    }
    if(!formData.email){
        errors.email = 'Email is required'
    } else if(!/\S+@\S+\.\S+/.test(formData.email)){
        errors.email = 'Email is invalid'
    }else{errors.email = ''
    }
    if(!formData.password){
        errors.password = 'Password is required'
    } else{
        errors.password = ''
    }
    if(!formData.termsAndConditions){
        errors.termsAndConditions = 'Accept terms and conditions to continue'
    } else {
        errors.termsAndConditions = ''
    }
    return errors
}

export function shopValidation(formData){
    let errors = {}

    if(!formData.shopname){
        errors.shopname = 'Cannot be empty'
        } else {
            errors.shopname = ''
        }
    if(!formData.country){
        errors.country = 'Please set your country'
    } else {
        errors.country = ''
    }
    if(!formData.city){
        errors.city = 'Cannot be empty'
    } else {
        errors.city = ''
    }
    if(!formData.activity){
        errors.activity = 'Cannot be empty'
    } else {
        errors.activity = ''
    }
    if(!formData.openingHour){
        errors.openingHour = 'Please provide open time'
    } else {
        errors.openingHour = ''
    }
    if(!formData.closeHour){
        errors.closeHour = 'Please provide close time'
    } else {
        errors.closeHour = ''
    }

    return errors
}

export default validation;