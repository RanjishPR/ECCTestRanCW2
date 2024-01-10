const check = (domain) => {

    let regex = /\-\d+/;
    if(regex.test(domain)){
        let updatedDomain = domain.replace(regex, '');
        return updatedDomain;
    }

    else
        return domain;
}

module.exports = check;