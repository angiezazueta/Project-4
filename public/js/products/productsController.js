(function() {
  angular.module('app')
    .controller("ProductListController", ProductListController)
    .controller("ProductShowController", ProductShowController)
    .controller("ProductNewController", ProductNewController)
    .controller("ProductEditController", ProductEditController);

    ProductListController.$inject = ['ProductResource'];
    ProductShowController.$inject = ['ProductResource', '$stateParams'];
    ProductNewController.$inject = ['ProductResource', '$state'];
    ProductEditController.$inject = ['ProductResource', '$stateParams', '$state'];

    function ProductListController(ProductResource) {
      var vm = this;
      vm.products = [];
      vm.destroy = destroy;

      ProductResource.query().$promise.then(function(products) {
        vm.products = products;

      });

      function destroy(productToDelete) {
        if (window.confirm("Are you sure you want to delete this product?")) {
            ProductResource.delete({id: productToDelete._id}).$promise.then(function (response) {
              console.log(response.message);
              vm.products = vm.products.filter(function(product) {
                return product != productToDelete;
              });
            });
          }
        }
      }

    function ProductShowController(ProductResource, $stateParams) {
      var vm = this;
      vm.product = {};

      ProductResource.get({id: $stateParams.id}).$promise.then(function(jsonProduct) {
          vm.product = jsonProduct;
      });
    }

    function ProductNewController(ProductResource, $state) {
      var vm = this;
      vm.newProduct = {};
      vm.addProduct = addProduct;

      function addProduct() {
        ProductResource.save(vm.newProduct).$promise.then(function(jsonProduct) {
          vm.newProduct = {};
          $state.go('productShow', {id: jsonProduct._id});
        });
      }
    }

    function ProductEditController(ProductResource, $stateParams, $state) {
      var vm = this;
      vm.product = {};
      vm.editProduct = editProduct;

      ProductResource.get({id: $stateParams.id}).$promise.then(function(jsonProduct) {
          vm.product = jsonProduct;
          vm.product.price = parseInt(vm.product.price)
         vm.product.quantity = parseInt(vm.product.quantity)

      });

      function editProduct() {
        ProductResource.update({id: vm.product._id}, vm.product).$promise.then(function(updatedProduct) {
          vm.product = updatedProduct;
          $state.go('productShow', {id: updatedProduct._id});
        });
      }
    }

})();
