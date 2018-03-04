var nas_data, corr_headers;
d3.csv('datasets/nas/CombinedCorrelation.csv', function(error, data) {
    if (error) {
        alert("File Not Found: datasets/nas/CombinedCorrelation.csv");
    }
    // Storing the data in a global variable
    // Getting CSV headers
    corr_headers = d3.keys(data[0]);
    // Converting data to labels and numbers from CSV strings
    nas_data = data.map(function (d){
        // console.log(d[corr_headers[1]]); Accessing the data dynamically
        return {
            Subjects: d.Subjects,
            Gender: +d.Gender,
            Age: +d.Age,
            Category: +d.Category,
            Samelanguage: +d.Samelanguage,
            Siblings: +d.Siblings,
            Handicap: +d.Handicap,
            Fatheredu: +d.Fatheredu,
            Motheredu: +d.Motheredu,
            Fatheroccupation: +d.Fatheroccupation,
            Motheroccupation: +d.Motheroccupation,
            Belowpoverty: +d.Belowpoverty,
            Usecalculator: +d.Usecalculator,
            UseInternet: +d.UseInternet,
            Usedictionary: +d.Usedictionary,
            Readotherbooks: +d.Readotherbooks,
            Books: +d.Books,
            Distance: +d.Distance,
            Computeruse: +d.Computeruse,
            Libraryuse: +d.Libraryuse,
            Likeschool: +d.Likeschool,
            GiveLangHW: +d.GiveLangHW,
            GiveMathHW: +d.GiveMathHW,
            GiveScieHW: +d.GiveScieHW,
            GiveSoScHW: +d.GiveSoScHW,
            CorrectLangHW: +d.CorrectLangHW,
            CorrectMathHW: +d.CorrectMathHW,
            CorrectScieHW: +d.CorrectScieHW,
            CorrectSocSHW: +d.CorrectSocSHW,
            HelpinStudy: +d.HelpinStudy,
            Privatetuition: +d.Privatetuition,
            Englishisdifficult: +d.Englishisdifficult,
            ReadEnglish: +d.ReadEnglish,
            Dictionarytolearn: +d.Dictionarytolearn,
            AnswerEnglishWB: +d.AnswerEnglishWB,
            AnswerEnglishaloud: +d.AnswerEnglishaloud,
            Mathsisdifficult:+d.Mathsisdifficult,
            SolveMaths: +d.SolveMaths,
            SolveMathsingroups: +d.SolveMathsingroups,
            Drawgeometry: +d.Drawgeometry,
            Explainanswers: +d.Explainanswers,
            SocSciisdifficult: +d.SocSciisdifficult,
            Historicalexcursions: +d.Historicalexcursions,
            ParticipateinSocSci: +d.ParticipateinSocSci,
            SmallgroupsinSocSci: +d.SmallgroupsinSocSci,
            ExpressSocSciviews: +d.ExpressSocSciviews,
            Scienceisdifficult: +d.Scienceisdifficult,
            Observeexperiments: +d.Observeexperiments,
            Conductexperiments: +d.Conductexperiments,
            Solvescienceproblems: +d.Solvescienceproblems,
            Expressscienceviews: +d.Expressscienceviews,
            WatchTV: +d.WatchTV,
            Readmagazine:+d.Readmagazine,
            Readabook: +d.Readabook,
            Playgames: +d.Playgames,
            Helpinhousehold: +d.Helpinhousehold
        };
    });
    console.log(nas_data);
});