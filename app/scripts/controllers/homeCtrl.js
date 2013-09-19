'use strict';

angular.module('kohlhoferApp')
  .controller('HomeCtrl', function ($scope,$location,$route,$routeParams,$anchorScroll) {

    $scope.projects = [
      {
        id: "about",
        title: "Kohlhofer 2013",
        tags: ["web", "angular", "mobile"],
        badge: {label:"Great",type:"new"},
        listImage: "images/projects/kohlhofer/thumb.svg",
        view: "views/projects/coming-soon.html",
        color: "#8FBE00"
      },
      {
        id: 1,
        title: "Irrepressible.info",
        tags: ["campaign"],
        listImage: "http://dummyimage.com/400x400/fff/24CB99.png&text=coming+soon",
        view: "views/projects/coming-soon.html",
        color: "#24CB99"
      },
      {
        id: "weewar",
        title: "Weewar",
        tags: ["game", "web"],
        listImage: "images/projects/weewar/thumb.png",
        view: "views/projects/coming-soon.html",
        color: "#d3e777"
      },
      {
        id: "enhancedwars",
        title: "Enhanced Wars",
        tags: ["game","web"],
        listImage: "images/projects/enhancedwars/thumb.png",
        view: "views/projects/enhancedwars.html",
        color: "#8BB5D7"
      },
      {
        id: 4,
        title: "Churchil Museum",
        tags: ["exhibition"],
        listImage: "http://dummyimage.com/400x400/fff/CB95E9.png&text=coming+soon",
        view: "views/projects/coming-soon.html",
        color: "#CB95E9"
      },
      {
        id: 5,
        title: "Quarter Spiral",
        tags: ["logo"],
        listImage: "images/projects/quarterspiral/thumb.svg",
        view: "views/projects/quarterspiral.html",
        color: "#EEE"
      },
      {
        id: 6,
        title: "Faces",
        tags: ["web","angularjs"],
        listImage: "images/projects/faces/thumb.png",
        view: "views/projects/faces.html",
        color: "#3585c3"
      },
      {
        id: 8,
        title: "Currencies",
        tags: ["app", "web", "angularjs"],
        listImage: "images/projects/currencies/thumb.svg",
        view: "views/projects/coming-soon.html",
        color: "#8A849B"
      },
      {
        id: 9,
        title: "Cryptography Project",
        tags: ["app", "web", "angularjs"],
        listImage: "http://dummyimage.com/400x400/fff/8FBE00.png&text=coming+soon",
        view: "views/projects/coming-soon.html",
        color: "#8FBE00"
      },
      {
        id: 7,
        title: "Mark Down",
        tags: ["app", "web", "angularjs"],
        listImage: "images/projects/markdown/thumb.svg",
        view: "views/projects/coming-soon.html",
        color: "#FFE"
      },
      {
        id: 10,
        title: "Balance Projector",
        tags: ["app", "web", "angularjs"],
        listImage: "http://dummyimage.com/400x400/fff/5AA54A.png&text=coming+soon",
        view: "views/projects/coming-soon.html",
        color: "#5AA54A"
      },
      {
        id: 11,
        title: "Life Stacks",
        tags: ["web", "angularjs"],
        listImage: "http://dummyimage.com/400x400/fff/FBC05B.png&text=coming+soon",
        view: "views/projects/coming-soon.html",
        color: "#FBC05B"
      },
      {
        id: 12,
        title: "Puzzle",
        tags: ["game", "web", "angularjs"],
        listImage: "images/projects/puzzle/thumb.svg",
        view: "views/projects/coming-soon.html",
        color: "#BCD"
      }
    ];




    $scope.life = [
      {
        year: 2012,
        events: [
          'Left Electronic Arts to work once more independently and to spend more time with my newly born daugther.',
          'Set up <a href="http://simplydo.com" target="new">Simply Do</a> to create and release smaller products and experiemnts which has been working splendidly.',
          'Co-Founded Quarter Spiral with the goal to create a new type of game publising platform. The numbers however <a href="http://quarterspiral.com" target="new">did not add up</a>.'
          ],
        lessons: [
          ]
      },
      {
        year: 2009,
        events: [
          'Joined Electronic Arts in Redwood City, California and helped grow a game studio from 6 people to almost 40. I started out as a technical director but eventually ran the techology platfrom enabeling our games as a producer. Ulitmately I oversaw the studio\'s integration with BioWare as interim Studio Manager with 35 direct and indirect reports.',
          'Received my EB 1 visa (Green Card) granting me the freedoom to live and work in the US in addition to most of Europe.'
          ],
        lessons: [
          "You always want to be in control of your life.",
          "Managing is a humble profession where the only success is that of your team."
          ]
      },
      {
        year: 2007,
        events: [
          'Bootstrapped <a href="#/project/weewar" target="new">Weewar</a> by living frugally in Salzburg, Austria (Sound of Music!). Sold the award winning browser game to Electronic Arts in 2009.',
          'Spent a lot of time consulting on projects around the world. Helped facilitate a <a href="http://www.britishcouncil.org/tn2020.htm" target="new">TN2020 summit</a> in Ireland and presented at Towards a Citizens Media Conference in Pakistan.',
          'Co-founded <a href="http://spreedly.com" target="new">Spreedly</a> to enable subscription based business models. I largely ceased my active involvment in 2009 when I joined EA as part of the Weewar exit but retain a minority share to date.'
          ],
        lessons: [
          ]
      },
      {
        year: 2004,
        events: [
          "Moved from the US to London, UK to work at Soda Creative. The Bafta Award winning team operated at the intersection of Art, Education and Play. I spent 4 years growing and learning and eventually became Soda's Creative Director.",
          "Succcessfully conceived, pitched and delivered a techology based anti-censorship campaign to Amnesty International.",
          'Working with the Tate we facilitated a <a href="http://www.tate.org.uk/whats-on/tate-britain/exhibition/nahnou-together" target="new">collaborative project</a> between students in London, UK and Damascus, Syria.'
          ],
        lessons: [
          "To create truly out standing things you have to ignore all boundaries and aim for the seemingly unfeasable.",
          "Working for a good cause is profound."
          ]
      },
      {
        year: 2002,
        events: [
          "Left Germany and the growing company I founded 3 years earlier behind and moved to the US, looking for an adventure.",
          "Securing a job and visa was an uphill battle to say the least, yet it unlocked most of what happened since. This was a fantastic time."
          ],
        lessons: [
          "I thrive on change: new country, new culture, new language."
          ]
      },
      {
        year: 1999,
        events: [
          'Founded <a href="http://schoeneneuekinder.de/" target="new">Schöne neue Kinder</a> Design Büro. The company quickly attracted a high profile client base. I left for the US in 2002 but Schöne Neue Kinder remains strong to date.',
          "Graduated with a diploma in Communications Design from a 4 year program at the University of Applied Sciences in Munich, Germany."
          ],
        lessons: [
          "First lessons in all aspects of enterpreunerhsip, growing a sustainable service company from nothing."
          ]
      }
    ];


    $('.carousel').carousel({
      interval: 6000
    })

    $scope.$on('$routeChangeSuccess', function (event, currentRoute, previousRoute) {
      var projectId;
      if ($routeParams.id) {
        projectId = $routeParams.id;
        for (var i = 0; i < $scope.projects.length; i++ ) {
          if ($scope.projects[i].id == projectId) {
            $anchorScroll('projectDetail');
            $scope.selectedProject = $scope.projects[i];
            $scope.showProjectDetail = true;
            return
          }
        }
      } else {
        $anchorScroll('projects');
        $scope.showProjectDetail = false;
      }
    });

    /*

    if ($routeParams.id) {
      $scope.selectedProject = $scope.projects[$routeParams.id];
      alert($scope.selectedProject);
    } else {
      $scope.selectedProject = null;
    }

    */

  });
