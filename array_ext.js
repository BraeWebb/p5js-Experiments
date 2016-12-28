// Courtesy of Samy Bencherif

function arrayEquals(array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
}

function arrayContains (thing) {
    if (!this)
        return false;

    var result = false;
    for (var i = 0, l=this.length; i < l; i++)
    {
        if (this[i] instanceof Array)
        {if (this[i].equals(thing))
            result = true;}
        else
        if (this[i]===thing)
            result = true;


    }
    return result;
}

function arrayIndexOf (thing)
{
    if (!this)
        return -1;

    var result = -1;
    for (var i = 0, l=this.length; i < l; i++)
    {
        if (this[i] instanceof Array)
            if (this[i].equals(thing))
                result = i;
            else
            if (this[i]===thing)
                result = i;


    }
    return result;
}

Object.defineProperty(Array.prototype, 'equals', {
    enumerable: false,
    value: arrayEquals
});

Object.defineProperty(Array.prototype, 'contains', {
    enumerable: false,
    value: arrayContains
});

Object.defineProperty(Array.prototype, 'indexOf', {
    enumerable: false,
    value: arrayIndexOf
});