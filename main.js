function pickPropArray(array, property)
{
    const result = [];
    for (let obj of array)
    {
        if (property in obj)
        {
            result.push(obj[property]);
        }
    }
    return result;
}

function createCounter()
{
    let count = 0;

    return function()
    {
        count++;
        console.log(count);
    }
}

function spinWords(str)
{
    const result = [];
    const words = str.split(' ');
    for (let i = 0; i < words.length; i++)
    {
        const word = words[i]
        if (word.length >= 5)
        {
            const letters = word.split('');
            const reverseLetters = letters.reverse();
            const reverseWord = reverseLetters.join('');
            result.push(reverseWord);
        }
        else
        {
            result.push(word)
        }
    }
    return result.join(' ');
}

function findIndexes(nums, target)
{
    for (let i = 0; i < nums.length; i++)
    {
        for (let j = i + 1; j < nums.length; j++)
        {
            if (nums[i] + nums[j] === target)
            {
                return [i, j]
            }
        }
    }
    return [];
}


