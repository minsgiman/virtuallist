## 풀이과정

* List가 무한대로 늘어나도 렌더링 성능에 영향을 최소화하기 위해 다음의 기능을 하는 Virtual List를 사용합니다.
    1) Viewport Items + Scroll Buffer Items 에 대한 row Element 들만 생성하여 유지합니다.
    2) 생성해놓은 Scroll Buffer Items 범위를 벗어나는 scroll 이벤트가 발생하면 현재 scrollTop 위치 기준으로 row Element 들을 다시 생성합니다.
    3) List의 끝까지 scroll 하면 파라미터로 전달받은 loadMore 콜백을 호출하고, 새로운 item들을 추가할 수 있는 Method를 제공합니다.
    4) itemHeight, itemClass 및 itemRender 콜백을 파라미터로 전달받아, 사용하는 쪽에서 원하는 대로 row를 그릴 수 있도록 지원합니다.
     
* Page Size 값을 15로 설정한 이유 : 
    Viewport Items의 개수를 5로 정하여서, 다음과 같이 Virtual List에서 생성하여 유지하는 최대 Element 개수 15를 한 페이지로 설정하였습니다.
     1) Viewport Items의 개수: 5
     2) 위쪽 Scroll Buffer Items 개수: 5
     3) 아래쪽 Scroll Buffer Items 개수: 5


## 코드설명

* 모듈분리를 위해 es module을 사용하였습니다. 다음과 같이 모듈을 분리하였습니다.
    1) /src/pages/user.js : VirtualList 인스턴스를 생성하고, API를 호출하여 List를 업데이트 합니다.
    2) /src/components/VirtualList.js : viewport상에 보이는 Items + Buffer Items의 Element만 생성하는 VirtualList 클래스를 제공합니다.
    3) /src/service/api.js : user list get api를 호출할 수 있는 method를 제공합니다.

* 3th Party Lib을 사용하지 않았습니다.

* style은 /stylesheets/style.css에 정의하였습니다.


## 실행방법

users API Server를 실행(npm start)하고, http://localhost:3000/users/view 에 접속합니다. 