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

function findPrefix(strs) 
{
    if (strs.length === 0) return "";
    const firstWord = strs[0];
    let result = "";
    for (let start = 0; start < firstWord.length; start++) 
    {
        for (let end = start + 2; end <= firstWord.length; end++) 
        {
            const candidate = firstWord.substring(start, end);
            let foundInAll = true;

            for (let i = 1; i < strs.length; i++) 
            {
                if (!strs[i].includes(candidate)) 
                {
                    foundInAll = false;
                    break;
                }
            }
            if (foundInAll && candidate.length > result.length) 
            {
                result = candidate;
            }
        }
    }

    return result;
}


