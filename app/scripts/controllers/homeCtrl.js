'use strict';

angular.module('kohlhoferApp')
  .controller('HomeCtrl', function ($scope,$location,$route,$routeParams,$anchorScroll) {

    $scope.projects = [
      {
        id: "about",
        title: "Home Page",
        tags: ["web", "angular", "mobile"],
        badge: {label:"Great",type:"new"},
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#BCD"
      },
      {
        id: 1,
        title: "Irrepressible.info",
        tags: ["campaign"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#24CB99"
      },
      {
        id: "weewar",
        title: "Weewar",
        tags: ["game", "web"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#d3e777"
      },
      {
        id: 3,
        title: "Enhanced Wars",
        tags: ["game","web"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#8BB5D7"
      },
      {
        id: 4,
        title: "Churchil Museum",
        tags: ["exhibition"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#CB95E9"
      },
      {
        id: 5,
        title: "Quarter Spiral Identity",
        tags: ["logo"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#DDD"
      },
      {
        id: 6,
        title: "Faces",
        tags: ["web","angularjs"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#317cb7"
      },
      {
        id: 8,
        title: "Currencies",
        tags: ["app", "web", "angularjs"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#8A849B"
      },
      {
        id: 9,
        title: "Cryptography Project",
        tags: ["app", "web", "angularjs"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#8FBE00"
      },
      {
        id: 7,
        title: "Mark Down",
        tags: ["app", "web", "angularjs"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#FFE"
      },
      {
        id: 10,
        title: "Balance Projector",
        tags: ["app", "web", "angularjs"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#5AA54A"
      },
      {
        id: 11,
        title: "Life Stacks",
        tags: ["web", "angularjs"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#FBC05B"
      },
      {
        id: 12,
        title: "Puzzle",
        tags: ["game", "web", "angularjs"],
        listImage: "https://lh4.googleusercontent.com/-7CsP_Y_QQjo/AAAAAAAAAAI/AAAAAAAADew/tx1MR0CRANg/photo.jpg",
        headerImage: "http://www.castelfalfi.co.uk/files/2013/04/NGF7672_gallery-1900x756.jpg",
        descriptionShort: "Even better",
        descriptionLong: "Even better than better",
        color: "#EDA22E"
      }
    ];




    $scope.life = [
      {
        year: 2012,
        events: [
          'Left Electronic Arts to work once more independently and to make myself more available to my newly born daugther.',
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
          'Co-founded <a href="http://spreedly.com" target="new">Spreedly</a> to enable subscription based business models. I largely ceased my active involvment in 2009 when I joined EA as part of the Weewar exit but retain a minority share to date.'
          ],
        lessons: [
          ]
      },
      {
        year: 2004,
        events: [
          "Moved from the US to London, UK to work at Soda Creative. The Bafta Award winning team operated at the intersection of Art, Education and Play. I spent 4 years growing and learning and eventually became Soda's Creative Director.",
          "Succcessfully conveived, pitched and delivered a techology based anti-censorship campaign to Amnesty International.",
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
          "Left Germany and the growing company I founded 3 years earlier behind and moved to the US, looking for new experienes.",
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
