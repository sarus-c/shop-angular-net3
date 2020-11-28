using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repo;
        public ProductsController(IProductRepository repo)
        {
            _repo = repo;

        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await _repo.GetProductsAsync();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _repo.GetProductByIdAsync(id);

            return Ok(product);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            var brands = await _repo.GetProductBrandsAsync();

            return Ok(brands);
        }

        [HttpGet("brands/{id}")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrand(int id)
        {
            var brand = await _repo.GetProductBrandByIdAsync(id);

            return Ok(brand);
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            var types = await _repo.GetProductTypesAsync();

            return Ok(types);
        }

        [HttpGet("types/{id}")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductType(int id)
        {
            var type = await _repo.GetProductTypeByIdAsync(id);

            return Ok(type);
        }
    }
}